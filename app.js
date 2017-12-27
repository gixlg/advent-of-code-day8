
fs = require('fs');
var instructions = [];
fs.readFile('input.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var exec = new IntructionExecuter();
  var ins = exec.createInstruction(exec.splitByLine(data));
  ins.forEach(function(instruction){
    exec.executeInstruction(instruction)
  });

  console.log("Largest value in any register: "+ exec.getMaxOf(exec.registries)) ;
  console.log("highest value held in any register during this process: "+ exec.getMaxOf(exec.maxRegistries)) ;

});

 function IntructionExecuter() {

  this.splitByLine = function(text){
    return text.split("\n");
  },
  
  this.createInstruction = function(lines){
    var instructions = [];
    lines.forEach(element => {
      var indexIf = element.indexOf("if");
      var operation = element.substring(0,indexIf);
      var condition = element.substring(indexIf + 3);
      instructions.push({
        operation: operation,
        condition: condition
      })
    });
    return instructions;
  }

  this.registries={};
  this.maxRegistries={};
  
  this.checkIfExist = function(registryName){
    if (!this.registries[registryName]){
      this.registries[registryName]=0;
      this.maxRegistries[registryName]=0;
    }
  },

  this.execute = function(condition){
    function evalWithVariables(func, vars) {
      var varString = "";
     
      for (var i in vars)
          varString += "var " + i + " = " + vars[i] + ";";   
     
      eval(varString + "; var result = (" + func + ")");
      return result;
     }

    return evalWithVariables(condition, this.registries);
  }

  this.executeInstruction = function(ins){
    var inputRegistryIf=ins.condition.split(" ")[0];
    var inputRegistryOperation=ins.operation.split(" ")[0];

    this.checkIfExist(inputRegistryIf);
    if (this.execute(ins.condition)){

      this.checkIfExist(inputRegistryOperation);
      this.registries[inputRegistryOperation] = this.execute(ins.operation.replace("inc","+").replace("dec","-"));
      this.maxRegistries[inputRegistryOperation] = Math.max(this.maxRegistries[inputRegistryOperation], this.registries[inputRegistryOperation]);
    }
  }

  this.getMaxOf= function(registry){
    var max = 0;
    for (var i in registry){
      if (registry[i] >max){
        max = registry[i];
      }
    }
    return max;
  }

}
