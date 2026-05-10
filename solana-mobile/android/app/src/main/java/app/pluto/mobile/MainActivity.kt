package app.pluto.mobile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // The hackathon app is currently implemented as a PWA. A production native
        // shell would mount the Pluto UI here and call PlutoMobileWalletAdapter
        // for wallet authorization and transaction signing.
    }
}
