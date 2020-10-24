import Amplify from "aws-amplify"
import Analytics from "@aws-amplify/analytics"
import { GraphQLAPI } from "@aws-amplify/api-graphql"
import { useEffect, useState } from "react"
import gql from "graphql-tag"

const awsRegion = ""
const graphqlEndpoint = ""
const apiKey = ""

Amplify.configure({
  Auth: {
    region: awsRegion,
    mandatorySignIn: true,
  },
  aws_appsync_graphqlEndpoint: graphqlEndpoint,
  aws_appsync_region: awsRegion,
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: apiKey,
})
Analytics.configure({ disabled: true })

const sub = gql`
  subscription widgetUpdated($id: ID!) {
    widgetUpdated(id: $id) {
      id
      name
    }
  }
`

function connect(setStatus) {
  GraphQLAPI.graphql({ query: sub, variables: { id: "123" } }, {}).subscribe({
    error: (err) => {
      console.log("SUBSCRIPTION ERROR", err)
      setStatus("Disconnected :(")
    },
    next: (data) => {
      console.log("SUBSCRIPTION DATA", data)
    },
  })
}

function App() {
  const [status, setStatus] = useState("Connected!")
  useEffect(() => {
    connect(setStatus)
  }, [])

  return <h1>WebSocket {status}</h1>
}

export default App
