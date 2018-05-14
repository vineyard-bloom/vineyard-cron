require('source-map-support').install()
import {generateDocs} from "vineyard-docs"

generateDocs({
  project: {
    name: 'Vineyard Cron Documentation'
  },
  paths: {
    src: ['source'],
    content: 'source/doc',
    output: 'doc',
    tsconfig: './tsconfig.json',
  }
})