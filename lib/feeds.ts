import { PERSON } from './site';

/* 이 사이트의 글은 전부 저장소 안의 상수입니다. 이 파일 둘만 예외로 밖에서 옵니다 —
   "최근 프로젝트"와 "최근 영상"은 손으로 적는 순간 배포 다음 날부터 최근이 아니게 됩니다.

   Next 16의 fetch는 기본이 캐시 안 함입니다. revalidate를 안 붙이면 홈이 통째로 요청마다
   렌더되는 동적 경로로 내려앉습니다 — 이 사이트의 전제(정적 프리렌더)가 조용히 깨집니다.
   6시간이면 영상 올리고 반나절 안에 붙고, GitHub 비인증 한도(IP당 시간당 60회)와도
   부딪히지 않습니다. */
const REVALIDATE = 21600;

/* 바깥이 죽었다고 배포까지 막지는 않습니다. 대신 빈 목록으로 조용히 넘어가지 말고
   빌드 로그에 남깁니다 — 화면에서는 "영상이 없는 것"과 구분되지 않기 때문입니다. */
function fell(what: string, err: unknown): [] {
  console.warn(`[feeds] ${what} 가져오기 실패 — 그 목록은 이번 빌드에서 비어 나갑니다:`, err);
  return [];
}

async function grab(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { headers, next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ← ${url}`);
  return res;
}

type Video = { id: string; title: string; date: string };
type Project = { name: string; url: string; lang: string | null; pushed: string; desc: string };

/** 2026-08-13 → 2026.08.13. 사이트의 다른 날짜와 같은 표기입니다. */
export const dotted = (iso: string) => iso.replace(/-/g, '.');

/* &amp;가 마지막이어야 합니다 — 먼저 풀면 "&amp;lt;"가 "<"까지 두 번 풀립니다. */
const unxml = (s: string) => s
  .replace(/&(?:#39|apos);/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const tag = (chunk: string, name: string) =>
  chunk.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? '';

/* 제목 끝에 줄줄이 붙는 해시태그는 유튜브 검색용이지 사람이 읽는 문장이 아닙니다.
   좁은 카드에서는 그것만 두 줄을 먹으므로 꼬리만 떼고, 떼서 남는 게 없으면 원문을 둡니다. */
const detag = (title: string) => title.replace(/(?:\s*#[^\s#]+)+\s*$/u, '').trim() || title;

/** 채널 RSS. 키도 인증도 없고 한도도 없습니다 — 최신 15개까지 옵니다. */
export async function recentVideos(limit = 4): Promise<Video[]> {
  try {
    const xml = await (await grab(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${PERSON.youtubeChannelId}`,
    )).text();
    return xml.split('<entry>').slice(1, limit + 1)
      .map((e) => ({
        id: tag(e, 'yt:videoId'),
        title: detag(unxml(tag(e, 'title'))),
        date: tag(e, 'published').slice(0, 10),
      }))
      .filter((v) => v.id && v.title);
  } catch (err) {
    return fell('YouTube 피드', err);
  }
}

type Repo = {
  name: string; html_url: string; description: string | null;
  language: string | null; pushed_at: string; fork: boolean; archived: boolean;
};

/** 최근에 손댄 순. 포크와 보관된 것은 "지금 하는 일"이 아니라 뺍니다. */
export async function recentProjects(limit = 4): Promise<Project[]> {
  try {
    const repos: Repo[] = await (await grab(
      `https://api.github.com/users/${PERSON.githubLogin}/repos?sort=pushed&per_page=20`,
      // GitHub은 User-Agent 없는 요청을 403으로 돌려보냅니다.
      { accept: 'application/vnd.github+json', 'user-agent': PERSON.githubLogin },
    )).json();
    return repos
      .filter((r) => !r.fork && !r.archived)
      .slice(0, limit)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        lang: r.language,
        pushed: r.pushed_at.slice(0, 10),
        desc: r.description ?? '',
      }));
  } catch (err) {
    return fell('GitHub 저장소', err);
  }
}
