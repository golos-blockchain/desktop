const git = require('simple-git')

// object with keys: all, branches, current
const gitBranches = async () => {
    return (await git()).branchLocal()
}

const gitClone = async (account, repo, branch, commitHash) => {
    const repoPath = account + '/' + repo
    const url = new URL(repoPath, 'https://github.com')
    let opts = []
    if (branch) {
        opts = ['-b', branch]
    }
    return await git().clone(url.toString(), opts)
}

module.exports = {
    gitBranches,
    gitClone
}
