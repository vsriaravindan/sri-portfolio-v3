import { NextResponse } from 'next/server';
import os from 'os';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = os.uptime();
  const uptimeStr = `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

  return NextResponse.json({
    status: 'ok',
    uptime: uptimeStr,
    memory: `${memPercent}% used (${(usedMem / 1024 / 1024).toFixed(0)}MB / ${(totalMem / 1024 / 1024).toFixed(0)}MB)`,
    version: process.env.npm_package_version || '3.2',
    platform: `${os.type()} ${os.release()}`,
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
  });
}
