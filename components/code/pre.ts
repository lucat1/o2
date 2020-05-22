import styled from '@emotion/styled'

const Pre = styled('pre')`
  tab-size: 2;
  .comment,
  .prolog,
  .doctype,
  .cdata {
    color: #5c6370;
  }

  .punctuation {
    color: #abb2bf;
  }

  .selector,
  .tag {
    color: #e06c75;
  }

  .property,
  .boolean,
  .number,
  .constant,
  .symbol,
  .attr-name,
  .deleted {
    color: #d19a66;
  }

  .string,
  .char,
  .attr-value,
  .builtin,
  .inserted {
    color: #98c379;
  }

  .operator,
  .entity,
  .url,
  .language-css .string,
  .style .string {
    color: #56b6c2;
  }

  .atrule,
  .keyword {
    color: #c678dd;
  }

  .function {
    color: #61afef;
  }

  .regex,
  .important,
  .variable {
    color: #c678dd;
  }

  .important,
  .bold {
    font-weight: bold;
  }

  .italic {
    font-style: italic;
  }

  .entity {
    cursor: help;
  }
`

export default Pre
