const steps = Array.from(document.querySelector(".steps").children);

let index = 0;

const show = "show";

let values = {};

const emailValidation = (email) => {
  const emailValidator = new RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );
  if (!emailValidator.test(email.value)) return false;
  return true;
};

const phoneValidation = (phone) => {
  const length = phone.value.length;
  let slicedValue;
  if (length === 13) {
    slicedValue = phone.value.slice(3);
  } else if (length === 12) {
    slicedValue = phone.value.slice(2);
  } else {
    slicedValue = phone.value;
  }
  const isNum = slicedValue
    .split("")
    .some((val) => !Number.isInteger(parseInt(val)));
  if (isNum)
    return {
      valid: false,
      errMessage: "Input must be digits",
    };
  if (phone.value.length < 10)
    return {
      valid: false,
      errMessage: "Should be 10 digits",
    };

  return {
    valid: true,
  };
};

const validation = (element) => {
  if (element.value !== "") {
    if (element.id === "email") {
      if (!emailValidation(element))
        return {
          valid: false,
          errMessage: "Invalid Email",
        };
      return {
        valid: true,
      };
    } else if (element.id === "phone") {
      return phoneValidation(element);
    }
    return {
      valid: true,
    };
  } else
    return {
      valid: false,
      errMessage: "Cannot be Empty",
    };
};


const selectOption = (key, value, parent) => {
  values[key.id] = value.textContent;
  Array.from(parent.children).forEach(item => {
    if(item.classList.contains('selected')) item.classList.remove('selected');
    parent.querySelector('.step__button__selected').classList.add('show');
  });
  key.classList.add('selected');
  console.log(values);
}

document.querySelector(".steps").addEventListener("click", (event) => {
  const target = event.target;
  if (
    target.classList.contains("forward") ||
    target.parentElement.classList.contains("forward")
  ) {
    let updateIndex = true;
    if (target.classList.contains("input-value")) {
      const inputs = Array.from(
        target.parentElement.previousElementSibling.children
      );
      inputs.forEach((input) => {
        const isValid = validation(input);
        if (isValid.valid) values[input.id] = input.value;
        else {
          input.style.borderColor = "orangered";
          !input.nextElementSibling.textContent &&
            (input.nextElementSibling.textContent = isValid.errMessage);
          updateIndex = false;
        }
      });
      console.log(values);
    } else if (target.classList.contains("option-value")) {
      selectOption(target.parentElement, target, steps[index]);
      // values[target.parentElement.id] = target.textContent;
      // target.parentElement.style.backgroundColor = '#D0F0C0';
      // let main = Array.from(steps[index].children);
      // main = main.slice(1, main.length-2);
      // console.log(main);
    } else if (target.classList.contains("option")) {
      selectOption(target, target.firstElementChild, steps[index]);
      // values[target.id] = target.firstElementChild.textContent;
      // target.style.backgroundColor = '#D0F0C0';
      // let main = Array.from(steps[index].children);
      // main = main.slice(1, main.length-1);
      // console.log(main);
    }
    if (updateIndex && !target.classList.contains("end")) {
      steps[index].classList.toggle(show);
      index += 1;
      steps[index].classList.toggle(show);
    }else if (updateIndex && target.classList.contains("end")){
        let tempParams = {
            from_name: "owais khan",
            type_of_loan: values.typeOfLoan,
            approximate_purchase: values.approximatePurchase,
            down_payment: values.downPayment,
            credit_score: values.creditScore,
            bankruptcy: values.bankruptcy,
            message: `${values.firstName} ${values.lastName} subscribed`,
            email: values.email,
            phone: values.phone,
            zip: values.zip
          };
          emailjs
            .send("service_cxs2chw", "template_rou68ij", tempParams)
            .then((res) => {
              if (res.status === 200) {
                steps[index].classList.toggle(show);
                index += 1;
                steps[index].classList.toggle(show);
              } else console.log("Email not sent😞");
            });
    }
  } else if (target.classList.contains("backward")) {
    steps[index].classList.toggle(show);
    index -= 1;
    steps[index].classList.toggle(show);
  }
});


const handleChange = event => {
    const target = event.target;
    const isValid = validation(target);
    if (isValid.valid) {
        target.style.borderColor = "#333333";
        target.nextElementSibling.textContent = '';
    } else {
        target.style.borderColor = "orangered";
        target.nextElementSibling.textContent = isValid.errMessage;
    }
}

document.querySelector("#email").addEventListener("change", (event) => handleChange(event));

document.querySelector("#phone").addEventListener("change", (event) => handleChange(event));

document.querySelector("#firstName").addEventListener("change", (event) => handleChange(event));

document.querySelector("#lastName").addEventListener("change", (event) => handleChange(event));
