import { styled } from 'goober'

const Pre = styled('pre')`
  tab-size: 2;

  .comment,
  .prolog,
  .doctype,
  .cdata {
    color: hsl(30, 20%, 50%);
  }

  .function {
    color: red;
  }

  .punctuation {
    opacity: 0.7;
  }

  .namespace {
    opacity: 0.7;
  }

  .property,
  .tag,
  .boolean,
  .number,
  .constant,
  .symbol {
    color: hsl(350, 40%, 70%);
  }

  .selector,
  .attr-name,
  .string,
  .char,
  .builtin,
  .inserted {
    color: hsl(75, 70%, 60%);
  }

  .operator,
  .entity,
  .url,
  .language-css .string,
  .style .string,
  .variable {
    color: hsl(40, 90%, 60%);
  }

  .atrule,
  .attr-value,
  .keyword {
    color: hsl(350, 40%, 70%);
  }

  .regex,
  .important {
    color: #e90;
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

  .deleted {
    color: red;
  }
`

export default Pre
