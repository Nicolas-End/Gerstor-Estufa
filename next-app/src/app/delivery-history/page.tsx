import Sidebar from "@/Components/sidebar";

export default function OrderDashboard() {
  const orders = [
    {
      pedido: "577309",
      restaurante: "burrito de casa",
      usuario: "marco",
      valor: "R$ 35",
      atendimento: "delivery (R$ 0,00)",
      status: "lido (23/03 - 20:24)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "577273",
      restaurante: "",
      usuario: "gabriel",
      valor: "R$ 36",
      atendimento: "delivery (R$ 0,00)",
      status: "lido (23/03 - 20:02)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "577256",
      restaurante: "bruna",
      usuario: "",
      valor: "R$ 59",
      atendimento: "delivery (R$ 0,00)",
      status: "lido (23/03 - 19:54)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "577236",
      restaurante: "pedro",
      usuario: "",
      valor: "R$ 85",
      atendimento: "delivery (R$ 0,00)",
      status: "lido (23/03 - 19:35)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "576736",
      restaurante: "luiza",
      usuario: "",
      valor: "R$ 79",
      atendimento: "balcão",
      status: "cancelado (22/03 - 20:23)",
      detalhes: "detalhes",
      isHighlighted: true,
    },
    {
      pedido: "576735",
      restaurante: "fabio",
      usuario: "",
      valor: "R$ 59",
      atendimento: "delivery (R$ 5,00)",
      status: "lido (22/03 - 20:21)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "576264",
      restaurante: "diego",
      usuario: "",
      valor: "R$ 45",
      atendimento: "delivery (R$ 5,00)",
      status: "lido (22/03 - 21:03)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "576250",
      restaurante: "henrique",
      usuario: "",
      valor: "R$ 64",
      atendimento: "delivery (R$ 5,00)",
      status: "lido (22/03 - 20:58)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
    {
      pedido: "576167",
      restaurante: "thiago",
      usuario: "",
      valor: "R$ 36",
      atendimento: "delivery (R$ 5,00)",
      status: "lido (22/03 - 19:54)",
      detalhes: "detalhes",
      isHighlighted: false,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com data e botão */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-medium text-gray-900">17/03/2022 - 24/03/2022</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">26 pedidos</span>
              <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">adicionar novo</button>
            </div>
          </div>

          {/* Tabela de pedidos */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">pedido</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">restaurante</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">usuário</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">atendimento</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.pedido}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      order.isHighlighted ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="text-blue-600 text-sm font-medium">{order.pedido}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.restaurante}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.usuario}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
                        <span className="text-sm font-medium text-gray-900">{order.valor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.atendimento}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm ${
                          order.status.includes("cancelado") ? "text-red-600" : "text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-purple-600 text-sm hover:text-purple-800">
                        {order.detalhes}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
