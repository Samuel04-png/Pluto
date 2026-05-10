plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "app.pluto.mobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "app.pluto.mobile"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")

    // Solana Mobile SDK pieces required for native Android MWA flows.
    implementation("com.solanamobile:mobile-wallet-adapter-clientlib-ktx:2.0.3")
    implementation("com.solanamobile:web3-solana:0.2.5")
    implementation("com.solanamobile:rpc-core:0.2.7")
    implementation("io.github.funkatronics:multimult:0.2.3")
}
