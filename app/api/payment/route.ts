export async function GET() {
    try {
        const response = await fetch("https://admin.sristoree.com/api/tripay/payment-channels", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log(response)
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        const grouped: Record<string, any[]> = result.data.reduce((acc: Record<string, any[]>, item: any) => {
            const groupName = item.group;
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push({
                code: item.code,
                status: item.active,
                icon: item.icon_url,
                name: item.name,
                total_fee: `${item.total_fee.flat} + ${item.total_fee.percent}%`,
                fee: [
                    { type: "flat", amount: item.total_fee.flat },
                    { type: "percent", amount: item.total_fee.percent },
                ]
            });
            return acc;
        }, {});

        return Response.json(grouped);
    } catch (error) {
  
        return Response.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
