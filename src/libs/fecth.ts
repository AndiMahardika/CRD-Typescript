export async function fetchData<T>(url: string, tag?: string){
  try {
    const response = await fetch(url);

    if(response.status !== 200){
      throw new Error(`Error fetching data with tag ${tag}`)
    }

    const data = (await response.json()) as T
    return data
  } catch (error) {
    console.log(error)
  }
}