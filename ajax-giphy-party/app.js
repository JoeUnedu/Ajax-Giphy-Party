// let get element by Id
const clickRemove = document.getElementById("button-images");
const clickSearch = document.getElementById("button-giphy");
const msgHolder = document.getElementById("text");
const removeGiphyHolder = document.getElementById("giphy-remove");

class Giphy {
  constructor() {
    // object is set for giphy id and url when it is loaded
    this.objectGiphy = {};

    // object  for ghiphy exist on the page
    this.giphySet = new Set();

    // let count number of giphy to be added
    this.giphyCounter = 0;
  }
  // function to save giphyId and url
  giphyIdUrl(id, url) {
    if (this.giphySet.has(id)) {
      return false;
    } else {
      this.giphySet.add(id);
      this.objectGiphy[id] = url;
      this.giphyCounter++;

      this.setLocalStorage(id, url, "add");

      return true;
    }
  }
  // let removes a Giphy
  removeId(aGiphyId) {
    if (this.giphySet.has(aGiphyId)) {
      this.giphySet.delete(aGiphyId);
      delete this.objectGiphy[aGiphyId];
      this.setLocalStorage(aGiphyId, "", "removeGiphy");
    }
  }
  // reset method for counter
  letAddReset() {
    this.giphyCounter = 0;
  }
  // get method for counter
  getGiphyAdded() {
    return this.giphyCounter;
  }
  //get total method for size
  getGiphyTotal() {
    return this.giphySet.size;
  }
  // reset method for object,set and counter (reset all)
  // let clear information for loaded giphys
  letResetAllMsg() {
    this.setLocalStorage("", "", "clear");
    this.objectGiphy = {};
    this.giphySet.clear();
    this.giphyCounter = 0;
  }

  setLocalStorage(id, url, activity) {
    switch (activity) {
      case "add": // let add
        localStorage.setItem("giphy1-" + id, JSON.stringify({ id, url }));
        // let  to convert array to make it easier to  pass it to local storage.
        localStorage.setItem("giphy0-ids", JSON.stringify([...this.giphySet]));
        break;
      case "removeGiphy": // let remove
        localStorage.removeItem("giphy1-" + id);
        //  convert to an array in order to pass it to local storage.
        localStorage.setItem("giphy0-ids", JSON.stringify([...this.giphySet]));
        break;
      case "clear": // let clear
        if (this.giphySet.size > 0) {
          for (let giphyId of this.giphySet) {
            localStorage.removeItem("giphy1-" + giphyId);
          }
          localStorage.removeItem("giphy0-ids");
        }
        break;
    }
  }
}

const giphyGiphy = new Giphy();

function setMsg(msg, dangerMsg) {
  msgHolder.innerHTML = msg;

  if (dangerMsg) {
    msgHolder.classList.add("text-danger");
  } else {
    msgHolder.classList.add("text-nodanger");
  }
}

function clearMsg() {
  msgHolder.innerHTML = "&nbsp;";
  msgHolder.classList.remove(...["error", "text-danger"]);
}
// let create new image for giphy
// add class for image giphy
function creatNewImage(newGiphy) {
  const newImgHolder = document.createElement("img");
  newImgHolder.setAttribute("id", newGiphy.id);
  newImgHolder.setAttribute("src", newGiphy.url);
  newImgHolder.classList.add("img-giphy");
  removeGiphyHolder.append(newImgHolder);
}

function letDisplay(newGiphy) {
  for (let i = 0; i < newGiphy.length; i++) {
    creatNewImage(newGiphy[i]);
  }

  if (giphyGiphy.getGiphyAdded() > 0) {
    setMsg(
      ` ${giphyGiphy.getGiphyTotal()} giphy on display. ` +
        "Click  on remove images' to remove all GIPhs.",
      false
    );
  }
}
//giphys for display input
function letSelectOurGiphy(input) {
  //

  const giphyArray = [];

  let i = 0;
  if (input.length > 0) {
    if (input.length > 1) {
      let counter = 0;
      while (counter < 1) {
        i = Math.floor(Math.random() * input.length);
        if (
          giphyGiphy.giphyIdUrl(
            input[i].id,
            input[i].images.downsized_medium.url
          )
        ) {
          giphyArray.push({
            id: input[i].id,
            url: input[i].images.downsized_medium.url,
          });
          counter++;
        }
      }
    } else {
      for (i = 0; i < input.length; i++) {
        if (
          giphyGiphy.giphyIdUrl(
            input[i].id,
            input[i].images.downsized_medium.url
          )
        ) {
          giphyArray.push({
            id: input[i].id,
            url: input[i].images.downsized_medium.url,
          });
        }
      }
    }
  }

  return giphyArray;
}

async function getGiphyGiphs(getSearch) {
  let symbols = "&#x1F601";
  let getSearchHolder = getSearch.split(" ").join("%20");
  try {
    const giphyApiKey = "&api_key=IKz2y2Rro6lpeYJpwX50CPbgWlPCC4qK";
    const url = `https://api.giphy.com/v1/gifs/search?q=${getSearchHolder}${giphyApiKey}`;
    const getRes = await axios.get(url); // axios.get

    if ((getRes.status = 200)) {
      if (getRes.data.data.length > 0) {
        const selectedGiphys = letSelectOurGiphy(getRes.data.data);
        letDisplay(selectedGiphys);
      } else {
        setMsg(" giphy not available '" + getSearch + symbols, false);
      }
    } else {
      setMsg(
        " search for '" +
          getSearch +
          "' not found (giphy  = " +
          getRes.status +
          ").",
        true
      );
    }
  } catch (e) {
    setMsg(
      "error (" +
        e.message +
        ") while connecting. Search '" +
        getSearch +
        "' not connected.",
      true
    );
  }
}

clickSearch.addEventListener("click", function (e) {
  e.preventDefault();

  clearMsg();
  giphyGiphy.letAddReset();

  const searchText = document.getElementById("text-search");

  if (searchText.value.trim().length > 0) {
    getGiphyGiphs(searchText.value.trim());
  }
});

clickRemove.addEventListener("click", function (event) {
  event.preventDefault();

  $("img.img-giphy").remove();

  clearMsg();
  giphyGiphy.letResetAllMsg();
});

// jquery to remove  image
$("#giphy-remove").on("click", "img", function () {
  const giphyId = $(this).attr("id");

  // remove the giphy from class storage
  giphyGiphy.removeId(giphyId);

  setMsg(` ${giphyGiphy.getGiphyTotal()} Giphy. `, false);

  $(this).remove();
});

// function  to load event on page
$(function () {
  const imgIds = JSON.parse(localStorage.getItem("giphy0-ids"));

  if (imgIds) {
    if (imgIds.length > 0) {
      const giphyArray = [];
      for (let giphyId of imgIds) {
        const giph = JSON.parse(localStorage.getItem("giphy1-" + giphyId));
        if (giph) {
          if (giph.id && giph.url) {
            if (giphyGiphy.giphyIdUrl(giph.id, giph.url)) {
              giphyArray.push({
                id: giph.id,
                url: giph.url,
              });
            }
          }
        }
      }
      if (giphyArray.length > 0) {
        letDisplay(giphyArray);
        if (giphyGiphy.getGiphyTotal() > 0) {
          if (giphyGiphy.getGiphyTotal() > 1) {
            setMsg(
              ` ${giphyGiphy.getGiphyTotal()} GIPHYs on your search. `,
              false
            );
          } else {
            setMsg(
              ` ${giphyGiphy.getGiphyTotal()} GIPHY on your search. `,
              false
            );
          }
        } else {
          clearMsg();
        }
      }
    }
  }
});
