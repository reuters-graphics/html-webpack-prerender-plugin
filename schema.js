module.exports = {
  oneOf: [
    // {
    //   'index.html': {
    //     'main': '#mything',
    //     'app': {
    //       selector: '#myApp',
    //       scope: { ... },
    //     }
    //   }
    // } ...
    {
      type: 'object',
      propertyNames: {
        pattern: '\.html$', // eslint-disable-line no-useless-escape
      },
      patternProperties: {
        '.*': {
          type: 'object',
          patternProperties: {
            '.*': {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    selector: { type: 'string' },
                    scope: { type: 'object' },
                    props: { type: 'object' },
                    injectPropsTo: {
                      type: 'string',
                      pattern: '^[a-zA-Z_][a-zA-Z0-9_]*$',
                    },
                  },
                  required: ['selector'],
                },
              ],
            },
          },
          minProperties: 1,
        },
      },
      minProperties: 1,
    },
    // {
    //   'main': 'myThing'
    // }
    //
    // or...
    //
    // {
    //    main: {
    //      selector: '#mySelector',
    //      scope: { ... }
    //    }
    // }
    {
      type: 'object',
      patternProperties: {
        '.*': {
          oneOf: [
            { type: 'string' },
            {
              type: 'object',
              properties: {
                selector: { type: 'string' },
                scope: { type: 'object' },
                props: { type: 'object' },
                injectPropsTo: {
                  type: 'string',
                  pattern: '^[a-zA-Z_][a-zA-Z0-9_]*$',
                },
              },
              required: ['selector'],
            },
          ],
        },
      },
      minProperties: 1,
    },
  ],
};
