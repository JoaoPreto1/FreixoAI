export const validateSlugParam = (paramName = 'slug') => {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: `O parâmetro '${paramName}' é obrigatório e deve ser uma cadeia de texto válida.`,
          param: paramName
        },
        timestamp: new Date().toISOString()
      });
    }

    // Permitir letras, números, hífenes e underscores
    const slugRegex = /^[a-zA-Z0-9_-]+$/;
    if (!slugRegex.test(value)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MALFORMED_SLUG',
          message: `O identificador '${value}' contém carateres inválidos. Use apenas letras, números e hífenes.`,
          param: paramName
        },
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

export const validateChatBody = (req, res, next) => {
  const { question, message } = req.body || {};
  const queryText = question || message;

  if (!queryText || typeof queryText !== 'string' || queryText.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_QUESTION',
        message: 'O campo "question" é obrigatório e não pode ser vazio.'
      },
      timestamp: new Date().toISOString()
    });
  }

  if (queryText.trim().length > 4000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'QUESTION_TOO_LONG',
        message: 'A pergunta excede o limite máximo permitido de 4000 carateres.'
      },
      timestamp: new Date().toISOString()
    });
  }

  const language = req.body.language;
  if (language && !['pt', 'en', 'es'].includes(language)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_LANGUAGE',
        message: 'O idioma deve ser um dos seguintes: "pt", "en", "es".'
      },
      timestamp: new Date().toISOString()
    });
  }

  next();
};

export const validateItineraryBody = (req, res, next) => {
  const { days, pace, interest, mobility } = req.body || {};

  // Validação de days (1 a 4)
  const parsedDays = Number(days);
  if (
    days === undefined ||
    days === null ||
    isNaN(parsedDays) ||
    !Number.isInteger(parsedDays) ||
    parsedDays < 1 ||
    parsedDays > 4
  ) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_DAYS',
        message: 'O campo "days" é obrigatório e deve ser um número inteiro entre 1 e 4.',
        param: 'days'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Validação de pace
  const allowedPaces = ['tranquilo', 'equilibrado', 'dinamico'];
  if (pace && !allowedPaces.includes(pace)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PACE',
        message: `O ritmo da visita deve ser um dos seguintes: ${allowedPaces.join(', ')}.`,
        param: 'pace'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Validação de interest
  const allowedInterests = ['cultura', 'natureza', 'enogastronomia', 'familia', 'geral'];
  if (interest && !allowedInterests.includes(interest)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INTEREST',
        message: `O perfil de interesse deve ser um dos seguintes: ${allowedInterests.join(', ')}.`,
        param: 'interest'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Validação de mobility
  const allowedMobility = ['carro', 'a-pe'];
  if (mobility && !allowedMobility.includes(mobility)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_MOBILITY',
        message: `O modo de mobilidade deve ser um dos seguintes: ${allowedMobility.join(', ')}.`,
        param: 'mobility'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Sanitização dos parâmetros validados
  req.body.days = parsedDays;
  req.body.pace = pace || 'equilibrado';
  req.body.interest = interest || 'cultura';
  req.body.mobility = mobility || 'carro';
  if (req.body.seed !== undefined && req.body.seed !== null) {
    req.body.seed = req.body.seed;
  }

  next();
};

