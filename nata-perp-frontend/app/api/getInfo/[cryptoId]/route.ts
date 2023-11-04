import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cryptoId = request.url.slice(request.url.lastIndexOf("/") + 1);

  console.log("cryptoId", cryptoId);
  console.log("now", new Date().toISOString());

  if (!cryptoId) {
    return NextResponse.json(
      { error: "Crypto ID is required" },
      { status: 400 }
    );
  }

  const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoId}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.image && data.image.large) {
      return NextResponse.json({
        price: data.market_data.current_price.usd,
        dailyChange: data.market_data.price_change_percentage_24h,
        priceHigh: data.market_data.high_24h.usd,
        priceLow: data.market_data.low_24h.usd,
        logoUrl: data.image.large,
      });
    } else {
      console.log("Logo not found");
      console.log(response.status);
      return NextResponse.json({ error: "Logo not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
