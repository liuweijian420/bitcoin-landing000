import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <>
    <main className="min-h-screen">
      {/* 導航欄 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="w-36 h-12 relative">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 144px, 144px"
              priority
            />
          </div>
          <div className="flex gap-8">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-all"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-all"
            >
              註冊
            </Link>
          </div>
        </div>
      </nav>

      {/* 英雄區塊 */}
      <section
        className="min-h-[600px] py-16 md:py-24 relative overflow-hidden flex items-center"
        style={{
          backgroundImage: "url('/BitCoin.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* 英雄區塊中間的 logo */}
            <div className="w-32 h-32 mx-auto mb-8 relative">
              {" "}
              {/* 調整尺寸以符合您的需求 */}
              <Image
                src="/logo2.jpg"
                alt="Hero Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 128px"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">創新 安全 卓越</h1>
            <p className="text-xl text-white mb-8">提供頂尖專業的利益保障</p>
            <Link
              href="/login"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
            >
              登入
            </Link>
          </div>
        </div>
      </section>

      {/* 公司簡介區塊 */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* 左上角裝飾 */}
            <div className="absolute -top-4 -left-4 w-16 h-16">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500"></div>
            </div>
            {/* 右下角裝飾 */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16">
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500"></div>
            </div>
            {/* 圖片 */}
            <div className="relative w-full h-[400px]">
              <Image
                src="/company-intro.jpg"
                alt="Company Introduction"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div>
            <div className="relative inline-block mb-6">
              <h2 className="text-3xl font-bold">公司簡介</h2>
              {/* 標題下方的橙色線條 */}
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-500"></div>
            </div>
            <p className="text-gray-600 mb-4">
              全新的數位資產交易所，創始團隊成百來自幣安全全領域，風控團隊每週加強後端安全功能建設。
            </p>
            <Link
              href="/about"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>
            {/* 強大優勢區塊 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">強大優勢</h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">開創新時代，助業務創造財富，助客戶獲得最佳產品</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 移動應用 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="relative w-full h-48 mb-6">
                <Image
                  src="/mobile-app.jpg"
                  alt="移動應用"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">移動應用</h3>
              <p className="text-gray-600 text-center">我們的介面可完美的適用於任何裝置，您可以輕鬆地瀏覽</p>
            </div>

            {/* 多重監管 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="relative w-full h-48 mb-6">
                <Image
                  src="/monitoring.jpg"
                  alt="多重監管"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">多重監管</h3>
              <p className="text-gray-600 text-center">在IOS、Android智慧型手機、平板、電腦等裝置皆可操作</p>
            </div>

            {/* 即時數字交易 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="relative w-full h-48 mb-6">
                <Image
                  src="/trading.jpg"
                  alt="即時數字交易"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">即時數字交易</h3>
              <p className="text-gray-600 text-center">我們的介面可完美的適用於任何裝置，您可以輕鬆地瀏覽</p>
            </div>

            {/* 多語言線上客服 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="relative w-full h-48 mb-6">
                <Image
                  src="/customer-service.jpg"
                  alt="多語言線上客服"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">多語言線上客服</h3>
              <p className="text-gray-600 text-center">我們是您的救星，時刻備戰，提供標準專業規劃</p>
            </div>
          </div>
        </div>
      </section>
            {/* 贊助及監管區塊 */}
            <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">贊助及監管</h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">開創全新時代，助您創造及保管財富</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 德意志邦金融監管局 */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-40 mb-4">
                <Image
                  src="/german-authority.jpg"
                  alt="德意志邦金融監管局"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-medium text-center">德意志邦金融監管局</h3>
            </div>

            {/* 英國金融行為監管局 */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-40 mb-4">
                <Image
                  src="/uk-authority.jpg"
                  alt="英國金融行為監管局"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-medium text-center">英國金融行為監管局</h3>
            </div>

            {/* 美國消費者安全委員會 */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-40 mb-4">
                <Image
                  src="/us-commission.jpg"
                  alt="美國消費者安全委員會"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-medium text-center">美國消費者安全委員會</h3>
            </div>

            {/* 日本消費者廳 */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-40 mb-4">
                <Image
                  src="/japan-agency.jpg"
                  alt="日本消費者廳"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-medium text-center">日本消費者廳</h3>
            </div>
          </div>
        </div>
      </section>
            {/* 免責聲明區塊 */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <Image
                src="/logo2.jpg"
                alt="Disclaimer Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 128px"
              />
            </div>

            {/* 免責聲明文字 */}
            <p className="text-gray-600 leading-relaxed">
              本網站提供的金融工具交易存在較大的風險，如果使用本網站提供的金融工具進行交易，您可能會遭受虧損超過，這些風險
              包括流動性降低、價格的變化、高波動性和無法控制的情況，在決定使用本網站提供的金融工具開始交易之前，您必須
              仔細查看資格認證和風險信息。
            </p>
          </div>
        </div>
      </section>
    </main>
    {/* 頁尾 */}
    <footer className="bg-pink-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-white text-sm">© 2025 BitcoinCash All Rights Reserved</p>
        </div>
      </footer>
    </>
  )
}

