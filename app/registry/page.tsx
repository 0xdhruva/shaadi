import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const gifts = [
  { name: "Silver Dinner Set", category: "Dining" },
  { name: "Crystal Wine Glasses (Set of 6)", category: "Dining" },
  { name: "Copper Cookware Set", category: "Kitchen" },
  { name: "Marble Rolling Pin and Board", category: "Kitchen" },
  { name: "Electric Pressure Cooker", category: "Appliances" },
  { name: "Stainless Steel Spice Box", category: "Kitchen" },
  { name: "Silk Bed Sheet Set", category: "Bedroom" },
  { name: "Handcrafted Wooden Photo Frame", category: "Decor" },
  { name: "Traditional Brass Lamp", category: "Decor" },
  { name: "Sandalwood Incense Gift Set", category: "Home" },
  { name: "Embroidered Cushion Covers", category: "Living Room" },
  { name: "Copper Water Pitcher", category: "Dining" },
  { name: "Hand-painted Ceramic Dinner Plates", category: "Dining" },
  { name: "Gold-plated Serving Bowls", category: "Dining" },
  { name: "Electric Spice Grinder", category: "Kitchen" },
  { name: "Stainless Steel Tiffin Set", category: "Kitchen" },
  { name: "Silk Throw Blanket", category: "Living Room" },
  { name: "Marble Coaster Set", category: "Dining" },
  { name: "Brass Pooja Thali Set", category: "Religious" },
  { name: "Handloom Cotton Bedspread", category: "Bedroom" },
  { name: "Stainless Steel Kadai with Lid", category: "Kitchen" },
  { name: "Silver-plated Puja Bell", category: "Religious" },
  { name: "Copper Hammered Water Jug", category: "Dining" },
  { name: "Handcrafted Wooden Spice Box", category: "Kitchen" },
  { name: "Silk Decorative Pillows", category: "Living Room" },
  { name: "Bronze Ganesha Statue", category: "Decor" },
  { name: "Electric Rice Cooker", category: "Appliances" },
  { name: "Brass Floor Lamp", category: "Decor" },
  { name: "Hand-woven Silk Carpet", category: "Living Room" },
  { name: "Silver-plated Ice Bucket", category: "Dining" },
  { name: "Marble Mortar and Pestle", category: "Kitchen" },
  { name: "Copper Foot Massage Bowl", category: "Wellness" },
  { name: "Handmade Ceramic Vase", category: "Decor" },
  { name: "Gold-plated Tea Set", category: "Dining" },
  { name: "Sandalwood Carved Photo Frame", category: "Decor" },
  { name: "Electric Indian Coffee Filter", category: "Appliances" },
  { name: "Brass Hanging Planter", category: "Decor" },
  { name: "Hand-embroidered Table Runner", category: "Dining" },
  { name: "Copper Ayurvedic Water Bottle", category: "Wellness" },
  { name: "Traditional Brass Diya Set", category: "Religious" },
  { name: "Handloom Silk Curtains", category: "Living Room" },
  { name: "Silver-plated Fruit Bowl", category: "Dining" },
  { name: "Electric Sandwich Maker", category: "Appliances" },
  { name: "Marble Chess Set", category: "Entertainment" },
  { name: "Copper Cocktail Shaker Set", category: "Bar" },
  { name: "Hand-painted Ceramic Planters", category: "Decor" },
  { name: "Stainless Steel Idli Maker", category: "Kitchen" },
  { name: "Brass Wall Clock", category: "Decor" },
];

export default function Registry() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-800">Wedding Registry</h1>
      <p className="text-center mb-8 text-red-700">Help Rahul and Priya start their new life together with these thoughtful gifts.</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{gift.name}</CardTitle>
              <CardDescription>{gift.category}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

