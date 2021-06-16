import React from 'react';

const Cell = ({ children, classname }: any) => {
  return <td className={classname}>{children}</td>;
};

const Row = ({ children, classname }: any) => {
  return (
    <tr style={{ pageBreakBefore: 'always' }}>
      {React.Children.map(children, (el) => {
        if (el.type === Cell) return el;
        return <td className={classname}>{el}</td>;
      })}
    </tr>
  );
};

const Grid = ({ children, classname }: any) => {
  return (
    <table className={classname}>
      <tbody>
        {React.Children.map(children, (el) => {
          if (!el) return;

          // This content will be inside it's own row.
          if (el.type === Row) return el;

          // The content is all inside a single cell (so a row)
          if (el.type === Cell) {
            return <tr>{el}</tr>;
          }

          // The content is one cell inside it's own row
          return (
            <tr>
              <td>{el}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

Grid.Row = Row;
Grid.Cell = Cell;

export default Grid;
