import { fetchGraphQL } from '../../contentfulAPI'

export const getAllContentfulComments = `query testingQ {
          commentCollection {
            total
            items {
              sys {
                id
                }
              
              trackId
              title
              body {
                json
              }
            }
          }
        }`

export function getComment(id: string) {
  return `query singleComent { 
          comment(id: "${id}") {
            trackId
            title
            body {
            json
            }
          }
        }`
}
