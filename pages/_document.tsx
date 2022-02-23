import Document, { Html, Main, NextScript, DocumentContext } from "next/document";
import React from "react";
import { flushChunks, ExtendedHead, revalidate, DevHotScript } from "@module-federation/nextjs-ssr/flushChunks";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {

    ctx?.res?.on("finish", () => {
      revalidate().then(() => {
        setTimeout(() => {
          process.exit()
        }, 50)
      })
    });

    const remotes = await flushChunks(process.env.REMOTES);
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      remoteChunks: remotes
    };
  }

  render() {
    return (
      <Html>
        <ExtendedHead>
          <meta name="robots" content="noindex" />
          {/* @ts-ignore*/}
          {Object.values(this.props.remoteChunks)}
        </ExtendedHead>
        <DevHotScript />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;