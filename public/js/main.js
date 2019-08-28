// Restricts input for the given textbox to the given inputFilter
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if(inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if(this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}

let validForm = {
  validUsername: false,
  validEmail: false,
  validPassword: false,
  validPassword2: false
};

if(document.getElementById("username") != null) {
  // Restrict input by using a regular expression filter
  setInputFilter(document.getElementById("username"), function(value) {
    return /^[a-z0-9._]*$/.test(value);
  });
  
  // Constantly checks entered username
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    document.getElementById("username").addEventListener(event, function() {
      if(!/^[a-z0-9]+[a-z0-9._][a-z0-9]+$/.test(this.value) || this.value.length < 6 || this.value.length > 30) {
        this.classList.add("input-invalid");
        this.classList.remove("input-valid");
        validForm.validUsername = false;
      } else {
        this.classList.add("input-valid");
        this.classList.remove("input-invalid");
        validForm.validUsername = true;
      }
    });
  });
}

if(document.getElementById("email") != null) {
  // Constantly checks entered email
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    document.getElementById("email").addEventListener(event, function() {
      if(!/^\S+@\S+$/.test(this.value)) {
        this.classList.add("input-invalid");
        this.classList.remove("input-valid");
        validForm.validEmail = false;
      } else {
        this.classList.add("input-valid");
        this.classList.remove("input-invalid");
        validForm.validEmail = true;
      }
    });
  });
}

if(document.getElementById("password") != null) {
  // Constantly checks entered password
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    document.getElementById("password").addEventListener(event, function() {
      if(this.value.length < 6 || this.value.length > 30) {
        this.classList.add("input-invalid");
        this.classList.remove("input-valid");
        validForm.validPassword = false;
      } else {
        this.classList.add("input-valid");
        this.classList.remove("input-invalid");
        validForm.validPassword = true;
      }
    });
  });
}

if(document.getElementById("password2") != null) {
  // Constantly checks repeated password
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    document.getElementById("password2").addEventListener(event, function() {
      if(this.value !== document.getElementById("password").value) {
        this.classList.add("input-invalid");
        this.classList.remove("input-valid");
        validForm.validPassword2 = false;
      } else {
        this.classList.add("input-valid");
        this.classList.remove("input-invalid");
        validForm.validPassword2 = true;
      }
    });
  });
}

// Constantly checks if form data is valid and enables/disables sign up button
["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
  window.addEventListener(event, function() {
    if(validForm.validUsername && validForm.validEmail && validForm.validPassword && validForm.validPassword2) {
      document.querySelector(".auth-btn").removeAttribute("disabled");
    } else {
      document.querySelector(".auth-btn").setAttribute("disabled", "");
    }
  });
});