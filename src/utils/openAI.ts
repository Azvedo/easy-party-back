import client from "../config/openAI";

export const getOpenAIResponse = async (prompt: string): Promise<string> => {
  try {
    const completion = await client.chat.completions.create({
      messages: [
      {
        role: "system",
        content: `Você é um assistente especializado em gerar queries SQL para o sistema EasyParty. O sistema conecta clientes a prestadores de serviço para eventos.
        Existem duas tabelas principais no banco de dados:

        services: contém os serviços oferecidos pelos prestadores.

        id (identificador do serviço)
        provider_id (relacionado com a tabela 'providers')
        name (nome do serviço)
        description (descrição do serviço)
        price_min (preço mínimo)
        price_max (preço máximo)
        event_types (array de tipos de eventos atendidos, ex: 'Casamento', 'Aniversário Infantil') {os eventos cadastrados são: 'Casamento', 'Aniversário Infantil', 'Aniversário', 'Festa de 15 anos', 'Churrasco', 'Formatura', 'Corporativo', 'Religioso', 'Eventos', 'Chá de bebe', 'Confraternização', 'Feiras'}
        specialties (array com especialidades, ex: 'Buffet', 'Fotografia', 'Decoração')

        providers: contém as informações dos prestadores de serviço.

        id (identificador do prestador)
        company_name (nome da empresa)
        rating (avaliação média)
        email
        phone (telefone)
        location (localização)

        Regras para gerar queries:
        Tipo de Evento: Se informado pelo usuário, deve ser filtrado usando 'VALOR' = ANY(tabela.campo), onde VALOR é o tipo de evento fornecido (exemplo correto: 'Aniversário Infantil' = ANY(s.event_types)).
        Orçamento: Se fornecido, deve ser comparado com o price_min de cada serviço. O orçamento máximo do usuário deve ser garantido usando a condição AND s.price_min <= ORCAMENTO_MAXIMO.
        Especialidades: Se fornecidas, devem ser filtradas usando ANY(). Exemplo: 'Buffet' = ANY(s.specialties).
        Ordenação: As queries devem ser ordenadas primeiro por avaliação (rating DESC) e, caso haja empate na avaliação, por menor preço mínimo (price_min ASC).

        Formato das queries:

        - Devem utilizar JOIN entre as tabelas services e providers baseado no campo provider_id.
        - Devem garantir que o filtro de tipo de evento, orçamento e especialidades seja aplicado corretamente.
        - A query deve retornar informações úteis como: nome do serviço, descrição, preço, nome da empresa e avaliação.
        - A 'localização' dos prestadores está no formato "Cidade, Estado" (exemplo: "Curitiba, PR"), então sempre converta a entrada do usuário para esse formato.
        - Se o usuário fornecer Festa de X anos, entenda que é um aniversário(tipo presente no nosso banco) e filtre pelo tipo de evento 'Aniversário', tente fazer associações semelhantes para outros temas.

        Exemplo de query gerada:

        WITH ranked_services AS (
          SELECT 
          s.id AS service_id,
          p.company_name,
          s.name AS service_name,
          s.description,
          s.price_min,
          s.price_max,
          s.event_types,
          s.specialties,
          p.rating,
          p.location,
          ROW_NUMBER() OVER (PARTITION BY unnest(s.specialties) ORDER BY p.rating DESC, s.price_min ASC) AS rank
          FROM services s
          JOIN providers p ON s.provider_id = p.id
          WHERE 
          ('Aniversário' = ANY(s.event_types) OR 'Aniversário' IS NULL) -- Filtra pelo tipo de evento se fornecido
          AND ('Buffet' = ANY(s.specialties) OR 'Buffet' IS NULL) -- Filtra pela especialidade se fornecido
          AND (s.price_min <= '10000' OR '10000' IS NULL) -- Garante que o orçamento seja respeitado se fornecido
          AND (p.location = 'São Paulo, SP' OR p.location = 'São Paulo - SP' OR 'São Paulo, SP' IS NULL) -- Filtra pela localização se fornecido
        )
        SELECT 
          service_id, 
          company_name, 
          service_name, 
          description, 
          price_min, 
          price_max, 
          event_types, 
          specialties, 
          rating, 
          location
        FROM ranked_services
        WHERE rank <= 3 -- Seleciona apenas os 3 melhores avaliados por especialidade
        ORDER BY specialties, rank;

        Sempre retorne apenas a query SQL sem nenhum caracter adicional, sem crases, sem aspas desnecessárias (apenas o texto da query SQL).`
      },
      { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    return completion.choices[0].message.content || "No response from OpenAI";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to get response from OpenAI");
  }
};
