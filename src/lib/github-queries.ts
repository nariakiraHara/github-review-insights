import { gql } from '@apollo/client';

export const GET_PULL_REQUESTS = gql`
  query GetPullRequests($owner: String!, $name: String!, $first: Int!, $after: String) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    repository(owner: $owner, name: $name) {
      pullRequests(
        first: $first
        after: $after
        states: [MERGED]
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          number
          title
          createdAt
          mergedAt
          state
          author {
            login
          }
          reviews(first: 50) {
            nodes {
              id
              createdAt
              state
              author {
                login
              }
            }
          }
          reviewRequests(first: 50) {
            nodes {
              id
              requestedReviewer {
                ... on User {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_REPOSITORY_INFO = gql`
  query GetRepositoryInfo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      owner {
        login
      }
      description
    }
  }
`;