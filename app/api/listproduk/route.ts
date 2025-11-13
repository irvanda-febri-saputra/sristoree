export async function GET() {
  try {
    const response = await fetch("https://admin.sristoree..com/api/listproduk", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Au ah ", error)
    return Response.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
