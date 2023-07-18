const buildTr = (key = "", value = "") => {
  return `
    <tr>
        <td class="drag-handler"></td>
        <td class="recipe-table__cell">
            <textarea class="recipe__text-field item" placeholder="关键字">${key}</textarea>
        </td>
        <td class="recipe-table__cell">
            <textarea class="recipe__text-field item" placeholder="填充值" style="width:800px;overflow-x:visible;overflow-y:visible;">${value}</textarea>
        </td>
        <td class="recipe-table__cell">
            <button class="recipe-table__del-row-btn">x</button>
        </td>
    </tr>
`;
};

$(document).ready(function () {
  var $tableBody = $("#recipeTableBody");
  chrome.storage.local.get().then((data) => {
    let html = "";
    let arr = Object.values(data);
    arr = arr.sort((a, b) => b.count - a.count);
    for (let key in arr) html += buildTr(arr[key].name, arr[key].content);
    $tableBody.append(html);
  });

  $(document).on("click", ".recipe-table__add-row-btn", function (e) {
    var $el = $(e.currentTarget);
    // var htmlString = $("#rowTemplate").html();
    // $tableBody.append(htmlString);
    $tableBody.append(buildTr());
    return false;
  });

  $(document).on("click", ".recipe-table__save-btn", function (e) {
    let fields = $("#recipeTableBody").find(".item");
    let count = fields.length;
    for (let i = 0; i < fields.length; ) {
      let key = fields[i++].value;
      let value = fields[i++].value;
      console.log(`${key} : ${value}`);
      saveToData(key, value, count--);
    }
    alert("保存成功");
    // var htmlString = $("#rowTemplate").html();
    // $tableBody.append(htmlString);
    return false;
  });

  $tableBody.on("click", ".recipe-table__del-row-btn", function (e) {
    var $el = $(e.currentTarget);
    var $row = $el.closest("tr");
    var key = $row.find(".item")[0].value;
    $row.remove();
    chrome.storage.local.remove(key);
    return false;
  });

  Sortable.create($tableBody[0], {
    animation: 150,
    scroll: true,
    handle: ".drag-handler",
  });
});
