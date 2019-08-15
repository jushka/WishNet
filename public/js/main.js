// Restricts input for the given textbox to the given inputFilter
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}

if(document.getElementById("username") != null) {
  // Restrict input by using a regular expression filter
  setInputFilter(document.getElementById("username"), function(value) {
    return /^[a-z0-9._]*$/.test(value);
  });
  
  // Constantly checks entered username
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    document.getElementById("username").addEventListener(event, function() {
      if (!/^[a-z0-9]+[a-z0-9._][a-z0-9]+$/.test(this.value) || this.value.length < 6 || this.value.length > 30) {
        this.style.borderBottom = "2px solid #ff4538";
      } else {
        this.style.borderBottom = "";
      }
    });
  });
}