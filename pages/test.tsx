import React from 'react';
import fetchGraphQL from '../fetchGraphQL';

function test({ categories }) {
  const items = JSON.parse(categories);
  return (
    <div>
      {items.map(({ name, object: { oid } }) => (
        <div key={oid}>{name}</div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const query = `
    {
      repository(name: "shubi-docs", owner: "Shubidumdu") {
        object(expression: "master:") {
          ... on Tree {
            entries {
              name
              type
              object {
                oid
              }
            }
          }
        }
      }
    }
  `;

  const result = await fetchGraphQL(query);
  const entries = result.data.repository.object.entries;
  const categories = entries.filter(({ type }) => type === 'tree');
  return {
    props: { categories: JSON.stringify(categories) },
  };
}

export default test;
