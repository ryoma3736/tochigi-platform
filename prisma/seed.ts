import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // カテゴリーデータの作成
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'construction' },
      update: {},
      create: {
        name: '建設業',
        slug: 'construction',
        description: '建設・リフォーム・外構工事など',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'restaurant' },
      update: {},
      create: {
        name: '飲食業',
        slug: 'restaurant',
        description: 'レストラン・カフェ・居酒屋など',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'retail' },
      update: {},
      create: {
        name: '小売業',
        slug: 'retail',
        description: '小売店・専門店・物販など',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // 建設業の業者データ
  console.log('🏗️  Creating construction companies...')
  const constructionCompanies = [
    {
      name: '栃木建設',
      email: 'info@tochigi-kensetsu.jp',
      phone: '028-111-1111',
      address: '栃木県宇都宮市本町1-1',
      description: '創業50年の総合建設会社。一般住宅からマンションまで幅広く対応します。',
      instagramHandle: 'tochigi_kensetsu',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: '新築住宅建設',
          description: '注文住宅の設計・施工を一貫して行います',
          priceFrom: 15000000,
          priceTo: 50000000,
          unit: '坪',
        },
        {
          name: 'リフォーム工事',
          description: 'キッチン・バス・トイレなどの水回りリフォーム',
          priceFrom: 500000,
          priceTo: 5000000,
          unit: '箇所',
        },
      ],
    },
    {
      name: 'リフォーム宮',
      email: 'contact@reform-miya.com',
      phone: '028-222-2222',
      address: '栃木県宇都宮市馬場通り2-2',
      description: 'リフォーム専門店。小さな修繕から大規模改修まで対応可能。',
      instagramHandle: 'reform_miya',
      subscriptionPlan: 'instagram_only',
      services: [
        {
          name: '水回りリフォーム',
          description: 'キッチン・浴室・洗面所のリフォーム',
          priceFrom: 300000,
          priceTo: 2000000,
          unit: '箇所',
        },
        {
          name: '外壁塗装',
          description: '住宅の外壁・屋根の塗装工事',
          priceFrom: 800000,
          priceTo: 2500000,
          unit: '棟',
        },
      ],
    },
    {
      name: '那須エクステリア',
      email: 'nasu@exterior.jp',
      phone: '0287-333-3333',
      address: '栃木県那須塩原市三島1-3',
      description: '外構工事・エクステリア専門。庭づくりからカーポートまで。',
      instagramHandle: 'nasu_exterior',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: 'ガーデニング工事',
          description: '庭の設計・施工、植栽',
          priceFrom: 200000,
          priceTo: 3000000,
          unit: '坪',
        },
        {
          name: 'カーポート設置',
          description: 'カーポート・ガレージの設置工事',
          priceFrom: 400000,
          priceTo: 1500000,
          unit: '台',
        },
      ],
    },
    {
      name: '足利ホームサービス',
      email: 'ashikaga@homeservice.co.jp',
      phone: '0284-444-4444',
      address: '栃木県足利市通り町4-4',
      description: '住宅の困りごと解決します。水漏れ・電気工事・内装まで。',
      subscriptionPlan: 'instagram_only',
      services: [
        {
          name: '水道修理',
          description: '水漏れ・詰まりなどの緊急対応',
          priceFrom: 8000,
          priceTo: 100000,
          unit: '件',
        },
        {
          name: '内装工事',
          description: 'クロス張替え・床材交換など',
          priceFrom: 50000,
          priceTo: 500000,
          unit: '室',
        },
      ],
    },
    {
      name: '小山塗装工業',
      email: 'oyama@tosou.com',
      phone: '0285-555-5555',
      address: '栃木県小山市駅南5-5',
      description: '塗装専門業者。外壁・屋根塗装、防水工事に自信あり。',
      instagramHandle: 'oyama_tosou',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: '外壁塗装',
          description: '戸建住宅の外壁塗装',
          priceFrom: 600000,
          priceTo: 1800000,
          unit: '棟',
        },
        {
          name: '屋根塗装',
          description: '屋根の塗装・防水工事',
          priceFrom: 400000,
          priceTo: 1200000,
          unit: '棟',
        },
      ],
    },
    {
      name: '株式会社 栄匠',
      email: 'info@eisho.org',
      phone: '0289-74-7717',
      address: '〒321-1111 栃木県鹿沼市板荷1358',
      description: 'リフォーム工事、キッチン・お風呂・トイレなどの水回り、増築・間取り変更、屋根外壁塗装、木質リフォーム、外構工事・エクステリアなど、幅広く対応します。',
      website: 'https://www.eisho.org/',
      instagramHandle: 'eisho8400',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: 'リフォーム工事',
          description: 'キッチン・お風呂・トイレなどの水回り、増築・間取り変更',
          priceFrom: 300000,
          priceTo: 5000000,
          unit: '箇所',
        },
        {
          name: '屋根外壁塗装',
          description: '屋根・外壁の塗装工事',
          priceFrom: 500000,
          priceTo: 2000000,
          unit: '棟',
        },
        {
          name: '木質リフォーム',
          description: '木材を活用したリフォーム工事',
          priceFrom: 500000,
          priceTo: 3000000,
          unit: '箇所',
        },
        {
          name: '外構工事・エクステリア',
          description: '庭・駐車場・エクステリアの施工',
          priceFrom: 300000,
          priceTo: 2500000,
          unit: '箇所',
        },
      ],
    },
  ]

  for (const companyData of constructionCompanies) {
    const { services, ...company } = companyData
    await prisma.company.create({
      data: {
        ...company,
        categoryId: categories[0].id,
        services: {
          create: services,
        },
        subscription: {
          create: {
            plan: company.subscriptionPlan,
            price: company.subscriptionPlan === 'platform_full' ? 10000 : 5000,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    })
  }
  console.log(`✅ Created ${constructionCompanies.length} construction companies`)

  // 飲食業の業者データ
  console.log('🍽️  Creating restaurant companies...')
  const restaurantCompanies = [
    {
      name: 'カフェ・ド・宮',
      email: 'info@cafe-de-miya.jp',
      phone: '028-666-6666',
      address: '栃木県宇都宮市大通り1-6',
      description: '地元食材を使った創作料理とスペシャリティコーヒーの店。',
      instagramHandle: 'cafe_de_miya',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: 'ランチセット',
          description: '日替わりランチとドリンクのセット',
          priceFrom: 1200,
          priceTo: 1800,
          unit: '人',
        },
        {
          name: 'ケータリング',
          description: 'パーティー・イベント向けケータリングサービス',
          priceFrom: 3000,
          priceTo: 8000,
          unit: '人',
        },
      ],
    },
    {
      name: '那須高原レストラン',
      email: 'nasu@highland-restaurant.com',
      phone: '0287-777-7777',
      address: '栃木県那須郡那須町高久2-7',
      description: '那須の自然に囲まれたフレンチレストラン。記念日に最適。',
      instagramHandle: 'nasu_highland',
      subscriptionPlan: 'instagram_only',
      services: [
        {
          name: 'コースディナー',
          description: 'シェフおまかせフルコース',
          priceFrom: 8000,
          priceTo: 15000,
          unit: '人',
        },
        {
          name: 'ウェディングパーティー',
          description: '少人数制ウェディングパーティー',
          priceFrom: 300000,
          priceTo: 1000000,
          unit: '組',
        },
      ],
    },
    {
      name: '居酒屋・足利',
      email: 'ashikaga@izakaya.jp',
      phone: '0284-888-8888',
      address: '栃木県足利市本町3-8',
      description: '地酒と地元食材の創作居酒屋。宴会最大40名まで対応。',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: '飲み放題コース',
          description: '2時間飲み放題付き宴会コース',
          priceFrom: 3500,
          priceTo: 6000,
          unit: '人',
        },
        {
          name: '貸切パーティー',
          description: '店舗貸切でのパーティープラン',
          priceFrom: 150000,
          priceTo: 300000,
          unit: '回',
        },
      ],
    },
    {
      name: 'ラーメン・日光',
      email: 'nikko@ramen.com',
      phone: '0288-999-9999',
      address: '栃木県日光市今市4-9',
      description: '地元で愛されて30年。自家製麺と濃厚スープが自慢。',
      instagramHandle: 'nikko_ramen',
      subscriptionPlan: 'instagram_only',
      services: [
        {
          name: '各種ラーメン',
          description: '醤油・味噌・塩・豚骨ラーメン',
          priceFrom: 750,
          priceTo: 1200,
          unit: '杯',
        },
        {
          name: '出張ラーメン',
          description: 'イベント・祭りへの出張販売',
          priceFrom: 50000,
          priceTo: 200000,
          unit: '日',
        },
      ],
    },
    {
      name: 'ベーカリー・小山',
      email: 'oyama@bakery.jp',
      phone: '0285-101-0101',
      address: '栃木県小山市中央町5-10',
      description: '毎朝焼きたてパンが並ぶ人気ベーカリー。カフェスペースあり。',
      instagramHandle: 'oyama_bakery',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: 'パンの販売',
          description: '食パン・菓子パン・惣菜パンなど',
          priceFrom: 150,
          priceTo: 500,
          unit: '個',
        },
        {
          name: 'ケータリングセット',
          description: 'パーティー用サンドイッチセット',
          priceFrom: 2000,
          priceTo: 5000,
          unit: '人',
        },
      ],
    },
  ]

  for (const companyData of restaurantCompanies) {
    const { services, ...company } = companyData
    await prisma.company.create({
      data: {
        ...company,
        categoryId: categories[1].id,
        services: {
          create: services,
        },
        subscription: {
          create: {
            plan: company.subscriptionPlan,
            price: company.subscriptionPlan === 'platform_full' ? 10000 : 5000,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    })
  }
  console.log(`✅ Created ${restaurantCompanies.length} restaurant companies`)

  // 小売業の業者データ
  console.log('🛍️  Creating retail companies...')
  const retailCompanies = [
    {
      name: '宇都宮セレクトショップ',
      email: 'utsunomiya@select.com',
      phone: '028-111-1112',
      address: '栃木県宇都宮市オリオン通り1-11',
      description: '国内外のセレクト商品を扱うセレクトショップ。',
      instagramHandle: 'utsunomiya_select',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: 'ファッションアイテム',
          description: '洋服・バッグ・アクセサリー',
          priceFrom: 3000,
          priceTo: 50000,
          unit: '点',
        },
        {
          name: 'パーソナルスタイリング',
          description: 'お客様に合わせたコーディネート提案',
          priceFrom: 10000,
          priceTo: 30000,
          unit: '回',
        },
      ],
    },
    {
      name: '那須ハンドメイド工房',
      email: 'nasu@handmade.jp',
      phone: '0287-222-2223',
      address: '栃木県那須郡那須町湯本2-12',
      description: '地元作家の手作り雑貨・アクセサリーを販売。',
      instagramHandle: 'nasu_handmade',
      subscriptionPlan: 'instagram_only',
      services: [
        {
          name: 'ハンドメイド雑貨',
          description: '陶器・木工・布小物など',
          priceFrom: 500,
          priceTo: 10000,
          unit: '点',
        },
        {
          name: 'ワークショップ',
          description: 'ハンドメイド体験教室',
          priceFrom: 2000,
          priceTo: 5000,
          unit: '人',
        },
      ],
    },
    {
      name: 'フラワーショップ・足利',
      email: 'ashikaga@flower.com',
      phone: '0284-333-3334',
      address: '栃木県足利市通り3丁目3-13',
      description: '季節の花とフラワーアレンジメントの専門店。',
      instagramHandle: 'ashikaga_flower',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: '生花販売',
          description: '季節の生花・観葉植物',
          priceFrom: 500,
          priceTo: 10000,
          unit: '束',
        },
        {
          name: 'フラワーアレンジメント',
          description: 'お祝い・お供え用アレンジメント',
          priceFrom: 5000,
          priceTo: 30000,
          unit: '点',
        },
      ],
    },
    {
      name: '日光お土産館',
      email: 'nikko@omiyage.jp',
      phone: '0288-444-4445',
      address: '栃木県日光市上鉢石町4-14',
      description: '日光の特産品・お土産を豊富に取り揃えています。',
      subscriptionPlan: 'instagram_only',
      services: [
        {
          name: '特産品販売',
          description: 'ゆば・羊羹・地酒など',
          priceFrom: 300,
          priceTo: 5000,
          unit: '点',
        },
        {
          name: 'ギフトセット',
          description: 'お土産用ギフトセット',
          priceFrom: 3000,
          priceTo: 10000,
          unit: 'セット',
        },
      ],
    },
    {
      name: '小山家具センター',
      email: 'oyama@kagu.com',
      phone: '0285-555-5556',
      address: '栃木県小山市駅東5-15',
      description: '北欧家具からオーダーメイドまで幅広く対応。',
      instagramHandle: 'oyama_kagu',
      subscriptionPlan: 'platform_full',
      services: [
        {
          name: '家具販売',
          description: 'ソファ・テーブル・チェアなど',
          priceFrom: 10000,
          priceTo: 500000,
          unit: '点',
        },
        {
          name: 'オーダーメイド家具',
          description: 'お客様のご要望に応じた特注家具',
          priceFrom: 50000,
          priceTo: 1000000,
          unit: '点',
        },
      ],
    },
  ]

  for (const companyData of retailCompanies) {
    const { services, ...company } = companyData
    await prisma.company.create({
      data: {
        ...company,
        categoryId: categories[2].id,
        services: {
          create: services,
        },
        subscription: {
          create: {
            plan: company.subscriptionPlan,
            price: company.subscriptionPlan === 'platform_full' ? 10000 : 5000,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    })
  }
  console.log(`✅ Created ${retailCompanies.length} retail companies`)

  // Bloom鍼灸整骨院のサンプル企業データの作成（Instagram連携あり）
  console.log('💐 Creating Bloom Acupuncture company with Instagram...')
  const bloomCompany = await prisma.company.create({
    data: {
      name: 'Bloom鍼灸整骨院',
      email: 'info@bloom-acu.jp',
      phone: '028-999-8888',
      address: '栃木県宇都宮市桜通り3-15',
      description: '心と体を癒す鍼灸整骨院。スポーツ障害から日常の痛みまで幅広く対応。',
      instagramHandle: 'bloom_acu',
      instagramToken: 'demo_instagram_token_bloom_acu', // デモ用トークン
      subscriptionPlan: 'platform_full',
      categoryId: categories[2].id, // 小売業カテゴリー
      services: {
        create: [
          {
            name: '鍼灸治療',
            description: '肩こり・腰痛・神経痛などの鍼灸治療',
            priceFrom: 3000,
            priceTo: 6000,
            unit: '回',
          },
          {
            name: '整骨治療',
            description: '骨折・脱臼・捻挫などの整骨治療',
            priceFrom: 2000,
            priceTo: 5000,
            unit: '回',
          },
          {
            name: 'スポーツマッサージ',
            description: 'アスリート向けマッサージ・ケア',
            priceFrom: 4000,
            priceTo: 8000,
            unit: '回',
          },
        ],
      },
      subscription: {
        create: {
          plan: 'platform_full',
          price: 10000,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      instagramPosts: {
        create: [
          {
            postId: 'bloom_post_1',
            caption: '本日も元気に営業中！肩こり・腰痛でお悩みの方、お気軽にご相談ください。 #Bloom鍼灸整骨院 #栃木 #宇都宮 #鍼灸 #整骨',
            mediaUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
            mediaType: 'IMAGE',
            permalink: 'https://instagram.com/p/bloom_post_1',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1日前
            likesCount: 45,
            commentsCount: 3,
          },
          {
            postId: 'bloom_post_2',
            caption: '新しい施術ベッドが入りました！より快適な治療をご提供できます。 #新設備 #鍼灸整骨院',
            mediaUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
            mediaType: 'IMAGE',
            permalink: 'https://instagram.com/p/bloom_post_2',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3日前
            likesCount: 62,
            commentsCount: 5,
          },
          {
            postId: 'bloom_post_3',
            caption: 'スポーツ選手のケアも行っています。パフォーマンス向上をサポート！ #スポーツマッサージ #アスリート',
            mediaUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
            mediaType: 'IMAGE',
            permalink: 'https://instagram.com/p/bloom_post_3',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5日前
            likesCount: 38,
            commentsCount: 2,
          },
          {
            postId: 'bloom_post_4',
            caption: '美容鍼も大好評です！お肌のお悩みもご相談ください。 #美容鍼 #美容 #アンチエイジング',
            mediaUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
            mediaType: 'IMAGE',
            permalink: 'https://instagram.com/p/bloom_post_4',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7日前
            likesCount: 71,
            commentsCount: 8,
          },
          {
            postId: 'bloom_post_5',
            caption: '院内の様子です。清潔で落ち着いた空間でリラックスしていただけます。 #院内紹介 #リラックス',
            mediaUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
            mediaType: 'IMAGE',
            permalink: 'https://instagram.com/p/bloom_post_5',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10日前
            likesCount: 54,
            commentsCount: 4,
          },
          {
            postId: 'bloom_post_6',
            caption: 'スタッフ一同、笑顔でお待ちしています！ #スタッフ紹介 #チーム',
            mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
            mediaType: 'IMAGE',
            permalink: 'https://instagram.com/p/bloom_post_6',
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12日前
            likesCount: 89,
            commentsCount: 12,
          },
        ],
      },
    },
  })
  console.log(`✅ Created Bloom鍼灸整骨院 with ${6} Instagram posts`)

  // サンプル問い合わせデータの作成
  console.log('📧 Creating sample inquiries...')
  const allCompanies = await prisma.company.findMany({
    select: { id: true, name: true, categoryId: true },
  })

  const sampleInquiries = [
    {
      customerName: '田中太郎',
      customerEmail: 'tanaka@example.com',
      customerPhone: '090-1234-5678',
      message: 'キッチンのリフォームを検討しています。見積もりをお願いします。',
      selectedItems: { services: ['水回りリフォーム', 'リフォーム工事'] },
      status: 'sent',
      companies: allCompanies
        .filter(c => c.categoryId === categories[0].id)
        .slice(0, 2)
        .map(c => c.id),
    },
    {
      customerName: '佐藤花子',
      customerEmail: 'sato@example.com',
      customerPhone: '090-2345-6789',
      message: '結婚式の二次会でケータリングをお願いしたいです。30名程度を予定しています。',
      selectedItems: { services: ['ケータリング', '貸切パーティー'] },
      status: 'sent',
      companies: allCompanies
        .filter(c => c.categoryId === categories[1].id)
        .slice(0, 2)
        .map(c => c.id),
    },
    {
      customerName: '鈴木一郎',
      customerEmail: 'suzuki@example.com',
      customerPhone: '090-3456-7890',
      message: '新築祝いのフラワーアレンジメントを贈りたいです。',
      selectedItems: { services: ['フラワーアレンジメント'] },
      status: 'sent',
      companies: allCompanies
        .filter(c => c.categoryId === categories[2].id && c.name.includes('フラワー'))
        .map(c => c.id),
    },
    {
      customerName: '高橋美咲',
      customerEmail: 'takahashi@example.com',
      customerPhone: '090-4567-8901',
      message: '外壁塗装を検討中です。築15年の木造住宅です。',
      selectedItems: { services: ['外壁塗装'] },
      status: 'sent',
      companies: allCompanies
        .filter(c => c.categoryId === categories[0].id && c.name.includes('塗装'))
        .map(c => c.id),
    },
    {
      customerName: '伊藤健二',
      customerEmail: 'ito@example.com',
      customerPhone: '090-5678-9012',
      message: '会社のイベントでラーメンの出張販売をお願いしたいです。',
      selectedItems: { services: ['出張ラーメン'] },
      status: 'sent',
      companies: allCompanies
        .filter(c => c.categoryId === categories[1].id && c.name.includes('ラーメン'))
        .map(c => c.id),
    },
  ]

  for (const inquiryData of sampleInquiries) {
    const { companies: companyIds, ...inquiry } = inquiryData
    await prisma.inquiry.create({
      data: {
        ...inquiry,
        companies: {
          create: companyIds.map(companyId => ({
            companyId,
          })),
        },
      },
    })
  }
  console.log(`✅ Created ${sampleInquiries.length} sample inquiries`)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
