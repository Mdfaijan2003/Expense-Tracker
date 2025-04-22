document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("input-text");
  const inputAmount = document.getElementById("input-Amount");
  const addExpenseBtn = document.getElementById("addExpenseBtn");
  const expenseForm = document.getElementById("expense-form");
  const list = document.getElementById("expense-list");
  const toggleChart = document.getElementById("toggleChart");
  const chartContainer = document.getElementById("chartContainer");
  const toggleList = document.getElementById("burger-icon");
  let chartRendered = false;
  let expenseChart;

  toggleList.addEventListener("click", () => {
    list.classList.toggle("hidden");
  });

  let expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

  // Input field --->Add expenses
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = inputText.value.trim();
    const amount = parseFloat(inputAmount.value.trim());

    const items = {
      name,
      amount,
      _id: Math.floor(Math.random() * 100000),
      get id() {
        return this._id;
      },
      set id(value) {
        this._id = value;
      },
    };
    expenseList.push(items);

    localStorage.setItem("expenseList", JSON.stringify(expenseList));

    renderList(expenseList);

    inputText.value = "";
    inputAmount.value = "";
  });

  list.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const itemId = parseInt(e.target.getAttribute("item-id"));

      expenseList = expenseList.filter((item) => item.id !== itemId);
      localStorage.setItem("expenseList", JSON.stringify(expenseList));

      renderList(expenseList);
    }
  });

  toggleChart.addEventListener("click", function () {
    // Toggle the visibility of the chart container
    if (chartContainer.style.display === "none") {
      chartContainer.style.display = "block";

      // Render the chart only once
      if (!chartRendered) {
        const ctx = document.getElementById("expenseChart").getContext("2d");

        // Example data; replace with your actual expense data
        const labels = expenseList.map((item) => item.name);
        const data = expenseList.map((item) => item.amount);
        const colors = [
          "#b30000",
          "#7c1158",
          "#4421af",
          "#1a53ff",
          "#0d88e6",
          "#00b7c7",
          "#5ad45a",
          "#8be04e",
          "#ebdc78",
        ];

        const expenseData = {
          labels: labels,

          // "Rent",
          // "Groceries",
          // "Utilities",
          // "Transportation",
          datasets: [
            {
              label: "Expenses",
              data: data,
              backgroundColor: colors,
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };

        const config = {
          type: "bar", // You can change this to 'line', 'pie', etc.
          data: expenseData,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };

        expenseChart = new Chart(ctx, config);
        chartRendered = true;
      }
    } else {
      chartContainer.style.display = "none";
    }
  });

  renderList(expenseList);
});

function renderList(expenseList) {
  const list = document.getElementById("expense-list");
  const total = document.getElementById("total");
  const currentDate = new Date();

  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  list.innerHTML = "";
  let totalAmount = 0;
  expenseList.forEach((expense) => {
    list.innerHTML += `
    <li class="flex justify-between items-center bg-[#2D3142] p-3 pl-0 rounded-lg shadow-sm hover:bg-[#3B4252] transition text-gray-300">
    <span class="flex items-center gap-2">
    <i data-lucide="${expense.name}" class="w-5 h-5 text-accent"></i>${expense.name}</span>

    <div class=" sm:gap-4 flex justify-center items-center text-shadow-2xs">

    <span class="p-4">${formattedDate}</span>
    <div class="sm:flex sm:gap-4 text-accent justify-center items-center">
    <span>$${expense.amount}</span>
    <button class=" bg-accent3 hover:bg-red-800 text-black  rounded-lg font-semibold tracking-wide shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 py-1 px-4" item-id="${expense.id}">Delete</button>
    </div>
    </div>
    </li>
    `;

    totalAmount += expense.amount;
  });
  total.textContent = totalAmount;
}
