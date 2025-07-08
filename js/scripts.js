const themeSwitcher = document.getElementById("theme-switcher");
const bodyElem = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const toDoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const btnFilter = document.getElementById("clear-completed");

function main() {
  // theme mode switcher
  themeSwitcher.addEventListener("click", () => {
    bodyElem.classList.toggle("light");
    const themeIcon = themeSwitcher.children[0];
    themeIcon.setAttribute(
      "src",
      themeIcon.getAttribute("src") === "./assets/images/icon-sun.svg"
        ? "./assets/images/icon-moon.svg"
        : "./assets/images/icon-sun.svg"
    );
  });

  // make the list when app loaded
  makeTodoElement(JSON.parse(localStorage.getItem("todos")));

  // drag task in list
  ul.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (
      e.target.classList.contains("card") &&
      !e.target.classList.contains("dragging")
    ) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];

      const currentPos = cards.indexOf(draggingCard);

      const newPos = cards.indexOf(e.target);

      if (currentPos > newPos) {
        ul.insertBefore(draggingCard, e.target);
      } else {
        // ul.insertBefore(e.target,draggingCard)
        ul.insertBefore(draggingCard, e.target.nextSibling);
      }
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currentPos, 1);

      todos.splice(newPos, 0, removed[0]);

      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });

  // add task button functions
  addBtn.addEventListener("click", () => {
    const item = toDoInput.value.trim();
    if (item) {
      toDoInput.value = "";
      const todos = !localStorage.getItem("todos")
        ? []
        : JSON.parse(localStorage.getItem("todos"));

      const currentTodo = {
        item: item,
        isCompleted: false,
      };

      todos.push(currentTodo);
      localStorage.setItem("todos", JSON.stringify(todos));

      makeTodoElement([currentTodo]);
    }
  });

  // add task with Enter
  toDoInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      addBtn.click();
    }
  });

  filter.addEventListener("click", (e) => {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });

  btnFilter.addEventListener("click", () => {
    const deletedIndexes = [];
    document.querySelectorAll(".card.checked").forEach((card) => {
      deletedIndexes.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener("animationend", () => {
        card.remove();
      });
    });
    removeAllDoneTodos(deletedIndexes);
  });
  function removeTodo(index) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function removeAllDoneTodos(indexes) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos.filter((todo, index) => {
      return !indexes.includes(index);
    });
    localStorage.setItem("todos",JSON.stringify(todos))
  }

  function stateTodo(index, isComplete) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos[index].isCompleted = isComplete;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  // making todo task ui
  function makeTodoElement(todoarray) {
    if (!todoarray) {
      return null;
    }

    const ItemsLeft = document.getElementById("items-left");

    todoarray.forEach((todoObject) => {
      //elements
      const card = document.createElement("li");
      const cbContainer = document.createElement("div");
      const cbInput = document.createElement("input");
      const checkSpan = document.createElement("span");
      const item = document.createElement("p");
      const clearBtn = document.createElement("clear");
      const img = document.createElement("img");

      // style classes
      card.classList.add("card");
      cbContainer.classList.add("cb-container");
      cbInput.classList.add("cb-input");
      checkSpan.classList.add("check");
      item.classList.add("item");
      clearBtn.classList.add("clear");

      // attribures
      card.setAttribute("draggable", true);
      cbInput.setAttribute("type", "checkbox");
      img.setAttribute("src", "./assets/images/icon-cross.svg");
      img.setAttribute("alt", "Clear It");
      item.textContent = todoObject.item;
      if (todoObject.isCompleted) {
        card.classList.add("checked");
        cbInput.setAttribute("checked", "checked");
      }

      //Add EventListeners
      card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });

      clearBtn.addEventListener("click", () => {
        const currentCard = clearBtn.parentElement;
        currentCard.classList.add("fall");
        const indexOfCurrentCard = [
          ...document.querySelectorAll(".todos .card"),
        ].indexOf(currentCard);
        removeTodo(indexOfCurrentCard);

        currentCard.addEventListener("animationend", () => {
          setTimeout(() => {
            currentCard.remove();
            ItemsLeft.textContent = document.querySelectorAll(
              ".todos .card:not(.checked)"
            ).length;
          }, 100);
        });
      });

      cbInput.addEventListener("click", () => {
        const currentCard = cbInput.parentElement.parentElement;
        const checked = cbInput.checked;
        const currentCardIndex = [
          ...document.querySelectorAll(".todos .card"),
        ].indexOf(currentCard);
        stateTodo(currentCardIndex, checked);
        checked
          ? currentCard.classList.add("checked")
          : currentCard.classList.remove("checked");

        ItemsLeft.textContent = document.querySelectorAll(
          ".todos .card:not(.checked)"
        ).length;
      });

      // DOM content
      clearBtn.appendChild(img);
      cbContainer.appendChild(cbInput);
      cbContainer.appendChild(checkSpan);
      card.appendChild(cbContainer);
      card.appendChild(item);
      card.appendChild(clearBtn);

      document.querySelector(".todos").appendChild(card);
    });

    ItemsLeft.textContent = document.querySelectorAll(
      ".todos .card:not(.checked)"
    ).length;
  }
}

document.addEventListener("DOMContentLoaded", main);
