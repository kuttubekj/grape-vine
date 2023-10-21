import { Fragment, type PropsWithChildren } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "./Header"

function Layout({ children }: PropsWithChildren) {
    return (
        <Fragment>
            {/* <figure className="fixed inset-0"> */}
            {/* <Image
          className="!h-[115%] lg:!h-[100%] object-cover object-top"
          src={asset_bg}
          alt=""
          placeholder="blur"
          fill
        /> */}
            {/* </figure> */}
            <main className="flex flex-col relative z-[1] sm:px-6 pb-8 min-h-screen items-center">
                <Header />
                {/* <section className="mt-8 lg:mt-20 w-full">{children}</section> */}
                <section className="mt-4 lg:mt-10 w-full">{children}</section>
                <div className="flex-grow" />
                <footer className="mt-16 text-xl w-full flex flex-col items-center">
                    <div className="grid grid-cols-1 gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-4 lg:max-w-5xl w-full p-4 items-center justify-items-center">
                        {[
                            {
                                href: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app",
                                title: "Docs",
                                desc: "Find in-depth information about the GrapeVine API."
                            },
                            {
                                href: "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app",
                                title: "Learn",
                                desc: "Learn fun tips, tricks and commands for GrapeVine."
                            }
                        ].map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                            >
                                <h2 className="mb-3 text-2xl font-semibold">
                                    {link.title}{' '}
                                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                        -&gt;
                                    </span>
                                </h2>
                                <p className="m-0 max-w-[30ch] text-sm opacity-50">{link.desc}</p>
                            </a>
                        ))}
                    </div>
                </footer>
            </main>
        </Fragment>
    )
}

export default Layout
