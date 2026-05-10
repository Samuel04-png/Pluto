package app.pluto.mobile

import android.net.Uri
import com.solana.mobilewalletadapter.clientlib.ConnectionIdentity
import com.solana.mobilewalletadapter.clientlib.MobileWalletAdapter

object PlutoMobileWalletAdapter {
    private val connectionIdentity = ConnectionIdentity(
        identityUri = Uri.parse("https://pluto.dev"),
        iconUri = Uri.parse("https://pluto.dev/pluto-mark.png"),
        identityName = "Pluto"
    )

    val client = MobileWalletAdapter(connectionIdentity = connectionIdentity)

    /*
     * Native flow:
     * 1. Connect to an MWA-compatible wallet using this client.
     * 2. Ask the wallet to sign/send the prepared Solana transaction.
     * 3. Let the wallet handle Seed Vault custody when available.
     *
     * Pluto should never read Seed Vault keys directly. Seed Vault support is
     * achieved through the wallet app that signs transactions for Pluto.
     */
}
