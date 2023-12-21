import dotenv from "dotenv";

dotenv.config();
// Remove before going live
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const WP_API_URL = process.env.WPGRAPHQL_ENDPOINT;

const fetchWordPressAPI = async (query, { variables } = {}) => {
    const headers = { "Content-Type": "application/json" };

    const res = await fetch(WP_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
        console.log(json.errors);
        throw new Error("Failed to fetch API");
    }

    return json.data;
};

export const fetchWordPressRegions = async () => {
    const data = await fetchWordPressAPI(`
    query FetchRegionsQuery {
        regions {
          edges {
            node {
              id
              title
              slug
              regionFields {
                cities {
                  nodes {
                    id
                    ...on City {
                      title
                    }
                    slug
                    
                  }
                }
              }
            }
          }
        }
      }
    `);

    return data.regions.edges;
};

export const fetchWordPressCities = async () => {
    const data = await fetchWordPressAPI(`
    query FetchCitiesQuery {
        cities {
          edges {
            node {
              id
              title
              slug
              cityFields {
                region {
                  node {
                    id
                    ... on Region {
                      title
                    }
                    slug
                  }
                }
              }
            }
          }
        }
      }
    `);

    return data.cities.edges;
};

export const fetchCitiesByRegion = async (regionSlug) => {
    let wordPressRegionCities = new Map();
    let cursor = null;
    let hasMore = true;
    let totalCount = 0;
    const limit = 500;

    const fetchBatchOfCities = async (cursor) => {
        const query = `
        query FetchCities($cursor: String) {
            region(id: "${regionSlug}", idType: SLUG) {
                regionFields {
                    cities(first: 100, after: $cursor) {
                        edges {
                            node {
                                id
                                slug
                                ... on City {
                                    title
                                }
                            }
                            cursor
                        }
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            }
        }
        `;

        const variables = { cursor };
        const response = await fetchWordPressAPI(query, variables);

        const cities =
            response?.region?.regionFields?.cities?.edges?.map((edge) => edge.node) ?? [];
        const newCursor =
            cities.length > 0
                ? response?.region?.regionFields?.cities?.edges.slice(-1)[0]?.cursor
                : null;
        const hasNextPage = response?.region?.regionFields?.cities?.pageInfo?.hasNextPage;
        totalCount += cities.length;

        return { cities, newCursor, hasNextPage };
    };

    while (hasMore && totalCount < limit) {
        const { cities, newCursor, hasNextPage } = await fetchBatchOfCities(cursor);

        cities.forEach((city) => wordPressRegionCities.set(city.id, city));
        cursor = newCursor;
        hasMore = hasNextPage;

        console.log(
            `Fetched ${wordPressRegionCities.size} cities for region ${regionSlug} so far. Has more: ${hasMore}`
        );
        if (!hasMore || totalCount >= limit) {
            break;
        }
    }

    return Array.from(wordPressRegionCities.values());
};
