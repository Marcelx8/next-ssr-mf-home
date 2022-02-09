
function getTodos(): Promise<any> {
  const data = fetch('https://jsonplaceholder.typicode.com/todos/5').then(res => res.json());
  return data
}

export default getTodos;