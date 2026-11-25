let invocations = 0;
export const handler = async (event) => {
  invocations++;
  return { invocations, name: event.name ?? null };
};
