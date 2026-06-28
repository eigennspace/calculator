# Immediate Execution (not Expression Parsing)

The calculator uses immediate-execution semantics: each operator button press commits the previous operation immediately and stores the new operator. This matches basic desk calculators, not scientific ones.

Expression parsing was rejected because the PRD explicitly scopes to simple left-to-right arithmetic with no precedence, parentheses, or chaining beyond two operands at a time. An expression parser would be over-engineering: it would require a tokenizer, AST, and evaluator for what a 5-line `switch` in the reducer achieves. If precedence or parentheses are ever needed, the parser is the obvious upgrade path — but that's explicitly out of scope.

**Status**: Accepted
**Options considered**: Expression-parsing (shunting-yard / recursive descent)
**Consequences**: Chained operations run left-to-right, operator-by-operator. `2 + 3 × 4 = 20`, not 14. This is correct behaviour for this product.
