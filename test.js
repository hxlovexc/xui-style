var a = 30;
var p = {
  a: 20,
  getA () {
    console.log(this);
  }
}

p.getA();