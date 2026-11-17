export async function getCasualPuzzle(difficulty){
    const r = await fetch(`/api/puzzles/casual/random/?difficulty=${difficulty}`);
    if (!r.ok){
        throw new Error(`failed to load puzzle: ${r.status}`)
    }
    return r.json();
}
