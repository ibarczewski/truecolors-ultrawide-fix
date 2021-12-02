job('demo') {
    steps {
        shell('echo Hello World!')
    }
}

job('fail build test') {
    steps {
        shell("exit 1")
    }
}