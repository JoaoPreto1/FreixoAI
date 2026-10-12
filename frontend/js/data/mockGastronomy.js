export const GASTRONOMY_DATA = {
  dishes: [
    {
      id: "sopas-tomate",
      title: "Sopas de Tomate com Ovos Escalfados",
      category: "Prato Tradicional",
      description: "Um prato rústico e perfumado de conforto, confecionado com pão caseiro transmontano, tomate maduro do vale, azeite virgem extra, alho e ervas aromáticas, coroado com ovos escalfados na própria calda.",
      pairing: "Vinho Branco Montes Ermos Colheita Selecionada",
      highlights: ["Pão tradicional de trigo e centeio", "Azeite de Freixo", "Tomate fresco biológico"]
    },
    {
      id: "posta-mirandesa",
      title: "Posta Tradicional na Brasa",
      category: "Carnes Nobres",
      description: "Generoso naco de carne tenra grelhado no ponto com sal grosso e temperado com o clássico molho transmontano de azeite, alho e louro. Acompanhada por batatas a murro e grelos salteados.",
      pairing: "Montes Ermos Tinto Grande Reserva D.O.C. Douro",
      highlights: ["Carne de Denominação de Origem Protegida", "Grelhada em brasas de carvalho", "Azeite virgem aromático"]
    },
    {
      id: "cabrito-assado",
      title: "Cabrito Transmontano Assado em Forno de Lenha",
      category: "Especialidade Festiva",
      description: "Carne tenra marinada em vinho branco, colorau e alho, assada lentamente em assadeira de barro com batatinhas douradas e arroz de forno com miúdos.",
      pairing: "Montes Ermos Tinto Reserva",
      highlights: ["Tradição de dias de festa e domingo", "Assado em forno a lenha tradicional"]
    },
    {
      id: "amendoas-cobertas",
      title: "Amêndoas Cobertas Tradicionais",
      category: "Doçaria & Confeitaria",
      description: "A joia doce da vila: amêndoas locais selecionadas cobertas artesanalmente com finas camadas de açúcar e canela em tachos de cobre por doceiras experientes.",
      pairing: "Vinho Generoso do Porto Tawny ou Licor de Amêndoa",
      highlights: ["Produção artesanal centenária", "Amêndoa de Freixo de alta qualidade"]
    }
  ],
  wines: [
    {
      name: "Montes Ermos Tinto Grande Reserva D.O.C.",
      producer: "Adega Cooperativa de Freixo de Espada à Cinta",
      grapes: "Touriga Nacional, Touriga Franca, Tinta Roriz",
      tastingNotes: "Cor rubi profunda, aroma complexo a frutos pretos maduros, notas de esteva e madeira nobre tostada. Na boca é encorpado, com taninos aveludados e final persistente.",
      alcohol: "14.5% vol.",
      image: "assets/images/douro-wine.png"
    },
    {
      name: "Montes Ermos Branco Colheita Selecionada",
      producer: "Adega Cooperativa de Freixo de Espada à Cinta",
      grapes: "Códega do Larinho, Rabigato, Viosinho",
      tastingNotes: "Aroma cítrico exuberante com notas florais e mineralidade marcante do solo xistoso. Frescura vibrante, ideal para os dias quentes de verão no rio.",
      alcohol: "13.0% vol.",
      image: "assets/images/douro-wine.png"
    }
  ],
  restaurants: [
    {
      name: "Restaurante O Candedo",
      specialty: "Posta na brasa, Sopas de Tomate, Cabrito assado",
      location: "Avenida Guerra Junqueiro, Centro",
      phone: "+351 279 652 230",
      rating: 4.8,
      priceRange: "€€",
      verification: {
        status: "pendente_validacao",
        isDemo: true,
        note: "Contacto e dados indicativos. Sujeito a confirmação direta com o restaurante."
      }
    },
    {
      name: "Restaurante da Congida (Margem do Douro)",
      specialty: "Peixes do rio, Grelhados no carvão, Vinhos do concelho",
      location: "Complexo Fluvial da Congida",
      phone: "+351 279 653 112",
      rating: 4.7,
      priceRange: "€€",
      verification: {
        status: "pendente_validacao",
        isDemo: true,
        note: "Contacto e horários sazonais sujeitos a confirmação no Complexo Fluvial."
      }
    },
    {
      name: "Tasca do Forno",
      specialty: "Petiscos transmontanos, Alheiras artesanais, Queijos e Enchidos",
      location: "Largo do Município",
      phone: "+351 279 652 441",
      rating: 4.9,
      priceRange: "€",
      verification: {
        status: "pendente_validacao",
        isDemo: true,
        note: "Contacto e dados indicativos. Sujeito a confirmação direta."
      }
    }
  ]
};
