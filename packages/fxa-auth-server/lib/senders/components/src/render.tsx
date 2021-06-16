import * as fs from 'fs';
import prettier from 'prettier';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Fxa from './Fxa';

const HelloWorldPage = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="stylesheet" href="tailwind.css"></link>
        <title>User Subscribed</title>
      </head>
      <body>
        <h1 className="bg-gray-100">Welcome to my newsletter</h1>
      </body>
    </html>
  );
};

render();

function render() {
  let html1 = ReactDOMServer.renderToStaticMarkup(<HelloWorldPage />);
  let html2 = ReactDOMServer.renderToStaticMarkup(<Fxa classname="" />);
  let htmlWDoc = '<!DOCTYPE html>' + html1 + html2;
  let prettyHtml = prettier.format(htmlWDoc, { parser: 'html' });
  let outputFile = './lib/senders/components/dist/render.html';
  fs.writeFileSync(outputFile, prettyHtml);
  console.log(`Wrote ${outputFile}`);
}
