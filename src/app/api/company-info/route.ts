import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

/**
 * 从URL中提取域名
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * 尝试从官网URL构建可能的logo路径
 */
function getLogoFromWebsite(websiteUrl: string): string[] {
  try {
    const urlObj = new URL(websiteUrl);
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

    // 常见的logo路径模式
    const logoPaths = [
      '/favicon.ico',
      '/logo.png',
      '/logo.svg',
      '/assets/logo.png',
      '/static/logo.png',
      '/images/logo.png',
      '/public/logo.png',
      '/img/logo.png',
      '/_next/static/media/logo.svg', // Next.js应用
    ];

    return logoPaths.map(path => `${baseUrl}${path}`);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyName } = await request.json();

    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的公司名称' },
        { status: 400 }
      );
    }

    // 提取请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // 初始化搜索客户端
    const config = new Config();
    const searchClient = new SearchClient(config, customHeaders);

    // 第一步：专门搜索公司官网
    const websiteQuery = `${companyName} 官网`;
    const websiteResponse = await searchClient.webSearch(websiteQuery, 5, true);

    let websiteUrl = '';
    let officialDomain = '';

    // 从搜索结果中找到官网
    if (websiteResponse.web_items && websiteResponse.web_items.length > 0) {
      // 优先选择权威性高的结果（auth_info_level高）
      const officialResult = websiteResponse.web_items.find(
        item => item.url && (
          item.url.includes(companyName) ||
          item.auth_info_level >= 3
        )
      ) || websiteResponse.web_items[0];

      if (officialResult.url) {
        websiteUrl = officialResult.url;
        officialDomain = extractDomain(officialResult.url);
      }
    }

    // 第二步：搜索公司logo（如果找到了官网）
    let logoUrl = null;
    if (officialDomain) {
      // 专门搜索官网logo
      const logoQuery = `${companyName} 官网 logo ${officialDomain}`;
      const logoResponse = await searchClient.webSearch(logoQuery, 5, true);

      if (logoResponse.web_items && logoResponse.web_items.length > 0) {
        // 查找包含logo_url的结果
        const logoResult = logoResponse.web_items.find(item =>
          item.logo_url && (
            item.url?.includes(officialDomain) ||
            item.site_name?.toLowerCase().includes(companyName.toLowerCase())
          )
        );

        if (logoResult?.logo_url) {
          logoUrl = logoResult.logo_url;
        }
      }
    }

    // 第三步：如果还没找到logo，尝试使用Clearbit Logo服务
    if (!logoUrl && officialDomain) {
      logoUrl = `https://logo.clearbit.com/${officialDomain}`;
    }

    // 第四步：获取公司描述
    let companyDescription = '';
    if (websiteResponse.summary) {
      companyDescription = websiteResponse.summary;
    } else if (websiteResponse.web_items && websiteResponse.web_items[0]?.snippet) {
      companyDescription = websiteResponse.web_items[0].snippet;
    }

    return NextResponse.json({
      name: companyName,
      logoUrl,
      description: companyDescription,
      website: websiteUrl,
      domain: officialDomain,
    });
  } catch (error) {
    console.error('获取公司信息失败:', error);
    return NextResponse.json(
      { error: '获取公司信息失败，请重试' },
      { status: 500 }
    );
  }
}
