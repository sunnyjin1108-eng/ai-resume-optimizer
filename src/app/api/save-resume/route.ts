import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { resume, companyName, selectedTemplate } = await request.json();

    if (!resume || !companyName) {
      return NextResponse.json(
        { error: '请提供简历内容和公司名称' },
        { status: 400 }
      );
    }

    // 初始化对象存储
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });

    // 生成文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `resumes/${companyName}_${timestamp}_${selectedTemplate}.txt`;

    // 上传简历文件
    const fileKey = await storage.uploadFile({
      fileContent: Buffer.from(resume, 'utf-8'),
      fileName: fileName,
      contentType: 'text/plain',
    });

    // 生成签名 URL（有效期 7 天）
    const signedUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 604800, // 7 天
    });

    return NextResponse.json({
      success: true,
      fileKey,
      downloadUrl: signedUrl,
    });
  } catch (error) {
    console.error('保存简历失败:', error);
    return NextResponse.json(
      { error: '保存简历失败，请重试' },
      { status: 500 }
    );
  }
}
