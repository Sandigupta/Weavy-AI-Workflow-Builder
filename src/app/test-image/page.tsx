"use client";
import Image from "next/image";

export default function TestImagePage() {
    const imagePath = "/images/custom/aa6lo32y9qozccggmvll.avif";

    return (
        <div className="bg-black text-white min-h-screen p-10">
            <h1>Image Test</h1>

            <div className="mb-8">
                <h2>Standard &lt;img&gt; tag:</h2>
                <img src={imagePath} alt="Standard Test" width="300" />
            </div>

            <div className="mb-8">
                <h2>Next.js &lt;Image&gt; tag:</h2>
                <Image src={imagePath} alt="Next Image Test" width={300} height={200} />
            </div>

            <div className="mb-8">
                <h2>Next.js &lt;Image&gt; unoptimized:</h2>
                <Image src={imagePath} alt="Unoptimized Test" width={300} height={200} unoptimized />
            </div>
        </div>
    );
}
