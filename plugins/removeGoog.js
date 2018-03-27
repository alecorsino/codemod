module.exports = function (babel) {
    const { types: t } = babel;
    
    const isGoogExpression = (exp,e) => {
            if(t.isCallExpression(e.expression)){
                if (e.expression.callee.object.name === 'goog'){
                    if (e.expression.callee.property.name === exp) {
                        // console.log('IS GOOG EXP:', exp,':', e)
                        return true;
                      }
                  }
              }
              return false;
    };
 
  
    let className = '';
  let imports = [];
  	let membExp = [];
  let membExpState = 0;
    return {
      name: "ast-transform", // not required
      visitor: {
        Program(path) {
          
        //   console.log('PROGRAM',path)
          
          path.node.body.forEach( function (e, i){
                if (isGoogExpression('require', e)){
                    let gPath = path.get('body')[i]
                    let nameSpace = e.expression.arguments[0].value.split('.');
                  	imports.push(nameSpace.join('/'));
                  	 className = nameSpace[nameSpace.length - 1]
                  	console.log('E:',nameSpace);
                 
                   	//gPath.traverse(updateGoogRequire,gPath.node)
                     gPath.replaceWith(
                    	t.importDeclaration(
                          [t.importDefaultSpecifier(t.identifier(className))]
                          , t.stringLiteral(nameSpace.join('/')))
                     );
                }
         
          })//forEach
                 
        },
        MemberExpression:{
        	
             
           enter(path) {
             membExpState++;
            	//  console.log("Entered!",membExpState);
             	membExp.push(path.node.property.name)
                // console.log('MemeberExpresson:',path.node.property.name)// === className

                if(t.isIdentifier(path.node.object)){
                  membExp.push(path.node.object.name)
                    // console.log('MemeberExpresson:OBJECT:', path.node.object.name)
                }

            },
            exit() {
              membExpState--;
              if (membExpState == 0){
              	// console.log("Exited!",membExp);
                let m = membExp.reverse().join('/');
                // console.log('NAME:',m)
                let found = imports.find(function(element) {
                  return element === m;
                });
                // console.log('IMPORTs',imports)
                found && console.log('FOUND', found);
                membExp =[];
              }
            }
              
        }
      }
    };
  }

