const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

var forms,
  lengthinput,
  lengthresult,
  widthinput,
  widthresult,
  heightinput,
  heightresult;

var dimensionInputResult = function (i, r) {
  return function (event) {
    event.preventDefault();
    r.innerHTML = i.value;
  };
};

export default async function HTMLHandlerInit() {
  forms = $$(".form");
  lengthinput = $(".length.input");
  lengthresult = $(".length.result");
  widthinput = $(".width.input");
  widthresult = $(".width.result");
  heightinput = $(".height.input");
  heightresult = $(".height.result");

  forms[0].addEventListener(
    "submit",
    dimensionInputResult(lengthinput, lengthresult)
  );
  forms[1].addEventListener(
    "submit",
    dimensionInputResult(widthinput, widthresult)
  );
  forms[2].addEventListener(
    "submit",
    dimensionInputResult(heightinput, heightresult)
  );
}
