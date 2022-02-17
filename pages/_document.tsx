import Document, { Html, Main, NextScript, DocumentContext } from "next/document";
import React from "react";
import { flushChunks, ExtendedHead, revalidate } from "@module-federation/nextjs-ssr/flushChunks";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    revalidate();
    return {
      ...initialProps,
      remoteChunks: await flushChunks(process.env.REMOTES)
    };
  }

  render() {

    return (
      <Html>
        <ExtendedHead>
          <meta name="robots" content="noindex" />
          {/* @ts-ignore*/}
          {this.props.remoteChunks}
        </ExtendedHead>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;