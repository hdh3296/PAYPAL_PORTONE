'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";

const PRODUCT = {
  name: "프리미엄 멤버십",
  price: 10,  // USD로 가격 변경 (약 10달러)
  description: "월간 프리미엄 멤버십 서비스입니다.",
  image: "/next.svg"    
};

export default function Home() {
  const [paymentId, setPaymentId] = useState<string>("");

  useEffect(() => {
    // 컴포넌트가 마운트된 후에 paymentId 생성
    setPaymentId(`payment-${crypto.randomUUID()}`);
  }, []);

  useEffect(() => {
    // paymentId가 생성된 후에만 결제 UI 로드
    if (!paymentId) return;

    const loadPaymentUI = async () => {
      // 결제 요청 데이터 준비
      const requestData = {
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId: paymentId,
        orderName: PRODUCT.name,
        totalAmount: PRODUCT.price,
        currency: "CURRENCY_USD",  // "USD"에서 "CURRENCY_USD"로 변경
        uiType: "PAYPAL_SPB" as const,
      } as const;

      try {
        // 페이팔 결제 버튼 렌더링
        await PortOne.loadPaymentUI(requestData, {
          onPaymentSuccess: (response) => {
            console.log("결제 성공:", response);
            // 결제 성공 시 처리
            alert('결제가 완료되었습니다!');
          },
          onPaymentFail: (error) => {
            console.error("결제 실패:", error);
            alert(`결제에 실패했습니다: ${error.message}`);
          },
        });
      } catch (error) {
        console.error("결제 UI 로드 실패:", error);
        alert('결제 시스템을 불러오는데 실패했습니다.');
      }
    };

    loadPaymentUI();
  }, [paymentId]);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-50">
      <main className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* 상품 정보 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">{PRODUCT.name}</h1>
          <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={PRODUCT.image}
              alt={PRODUCT.name}
              fill
              className="object-contain p-4"
            />
          </div>
          <p className="text-gray-600 mb-4">{PRODUCT.description}</p>
          <p className="text-xl font-bold text-blue-600">
            {PRODUCT.price.toLocaleString()}원
          </p>
        </div>

        {/* 페이팔 결제 버튼이 렌더링될 컨테이너 */}
        <div className="portone-ui-container">
          {/* 여기에 페이팔 버튼이 자동으로 렌더링됩니다 */}
        </div>
      </main>
    </div>
  );
}
