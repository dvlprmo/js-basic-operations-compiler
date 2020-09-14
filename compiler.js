

// declartion of operations
const mul = (...operands) => operands.reduce((a, c) => a*c,1)
const sub = (...operands) => operands.reduce((a, c) => a-c)
const sum = (...operands) => operands.reduce((a, c) => a+c, 0)

// develop a parser

// we will have only numbers and operations. 
// Node type:
/* Example: 
   sum operator applied to 2,3,4:
      {
          type: operation,
          val: 'sum',
          expr: [{
              type: number,
              val: 2
          }, {
              type: number,
              val: 3
          }, {
              type: number,
              val: 4
          }]}

*/
const opration = Symbol('op');
const number = Symbol('num');

// develope a lex
const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);

// develop a parse
const parse = tokens => {
    let c = 0;
    
    const peek = () => tokens[c]; // return element of tokens associated with the current value of the c local variable.
    const consume = () => tokens[c++]; //  returns the element of tokens associated with the current value of the c local variable and increments c.

    const parseNum = () => ({ // gets the current token (i.e. invokes peek()), parses it to a natural number and returns a new number token.
        val: parseInt(consume()),  
        type: number
    })

    const parseOp = () => {
        const node = {
            val: consume(),
            type: opration,
            expr: []
        };
        while (peek()) node.expr.push(parseExpr());
        return node;
    };

    const parseExpr = () => /\d/.test(peek()) ? parseNum() : parseOp(); // checks if the current token matches the regular expression /\d/ (i.e. is a number) and invokes parseNum if the match was successful, otherwise returns parseOp.
    return parseExpr();
}

// develope the Transpiler
const transpile = ast => {
    const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
    const transpileNode = ast => ast.type === number ? transpileNum(ast) : transpileOp(ast);
    const transpileNum = ast => ast.val;
    const transpileOp = ast => `(${ast.expr.map(transpileNode).join(' ' + opMap[ast.val] + ' ')})`;
    return transpileNode(ast);
  };

  const op1 = 'sum 1 1';
  const op2 = 'mul 4 sum 3 5'
  console.log(transpile(parse(lex(op2))));
  console.log(eval(transpile(parse(lex(op2)))));