package com.wandoujia.webviewinjectiondemo;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Handler;
import android.os.SystemClock;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.view.KeyEvent;
import android.widget.Toast;
import android.webkit.JavascriptInterface;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ByteArrayInputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;


public class MainActivity extends ActionBarActivity {
    private static final String TAG = "Injection";
    private WebView webView;
    private String homepage = "http://snaptube.in/_sites-page/index.html";
    private String injection;
    private ProgressBar spinner;
    private Boolean isInjectDone = false;
    private Handler customHandler = new Handler();

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler(this));
        setContentView(R.layout.activity_main);

        spinner = (ProgressBar) findViewById(R.id.loadindicator);
        injection = loadStringFromAsset(MainActivity.this, "min.js");

        webView = (WebView) findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebContentsDebuggingEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.setWebViewClient(new WebViewClient() {

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                WebResourceResponse response = null;
                if (isBlockHost(Uri.parse(url)) && url.endsWith("js")) {
                    Log.d("DumResp", url);
                    try {
                        response = genDumbyRespnse();
                    } catch (Exception e) {
                        return response;
                    }
                }
                return response;
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Toast.makeText(MainActivity.this, "Oh no! " + description, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onLoadResource(WebView view, String url) {
//            webView.loadUrl("javascript: "+"if(document.title) {Android.loadCustStyle()}");
                if(!isInjectDone) {
                    log("Inject refine tweak code");
                    webView.loadUrl("javascript: " + injection);
                }
                Log.d(TAG, "Load Resource: " + url);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                isInjectDone = false;
//         if(url.startsWith("data:")) return; // escape loadData
                log("onPageStarted: " + url);
                spinner.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                log("onPageFinished: " + url);
                spinner.setVisibility(View.GONE);
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
            }
        });

        webView.loadUrl(homepage);
    }

    private void log(String s) {
        android.util.Log.d(TAG, s);

//        String text = s + "\n" + consoleView.getText();
//        consoleView.setText(text);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            //if Back key pressed and webview can navigate to previous page
            webView.goBack();
            // go back to previous page
            return true;
        } else {
            finish();
            // finish the activity
        }
        return super.onKeyDown(keyCode, event);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            startActivity(new Intent(this, SettingsActivity.class));
            return true;
        } else if (id == R.id.action_refresh) {
            reload();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void reload() {
        webView.loadUrl(homepage);
    }

    private Boolean isBlockHost(Uri uri) {
        try {
            String[] adsHostArr = {
                    "admaster.union.ucweb.com",
                    "serve.vdopia.com",
                    "cdn.vdopia.com",
                    "sdk.adspruce.com",
                    "cdn.admoda.com",
                    "my.mobfox.com",
                    "ads.adiquity.com",
                    "show.ketads.com",
                    "ad.atdmt.com"
            };
            String host = uri.getHost();
            return Arrays.asList(adsHostArr).contains(host);
        } catch (Exception e) {
            return false;
        }
    }

    private WebResourceResponse genDumbyRespnse() {
        String exampleString = "";
        InputStream stream = new ByteArrayInputStream(exampleString.getBytes(StandardCharsets.UTF_8));
        return new WebResourceResponse("text/javascript", "UTF-8", stream);
    }

    private static String loadStringFromAsset(Context context, String path) {
        char[] buf = new char[1024];
        try {
            InputStream input = context.getAssets().open(path);
            InputStreamReader reader = new InputStreamReader(input);
            StringBuilder builder = new StringBuilder();
            while (true) {
                int len = reader.read(buf);
                if (len <= 0) {
                    break;
                }
                builder.append(buf, 0, len);
            }
            return builder.toString();
        } catch (Exception e) {
            Log.d(TAG, "Load Asset: " + e);
            return "";
        }
    }

    public class WebAppInterface {
        Context mContext;

        /**
         * Instantiate the interface and set the context
         */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /**
         * Show a toast from the web page
         */
        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void hideSpinner() {
            spinner.setVisibility(View.GONE);
        }

        @JavascriptInterface
        public void injectDone() {
            isInjectDone = true;
        }
    }

    private void messageBox(String method, String message) {
        Log.d("EXCEPTION: " + method, message);

        AlertDialog.Builder messageBox = new AlertDialog.Builder(this);
        messageBox.setTitle(method);
        messageBox.setMessage(message);
        messageBox.setCancelable(false);
        messageBox.setNeutralButton("OK", null);
        messageBox.show();
    }


    public class ExceptionHandler implements
            java.lang.Thread.UncaughtExceptionHandler {
        private final Activity myContext;
        private final String LINE_SEPARATOR = "\n";

        public ExceptionHandler(Activity context) {
            myContext = context;
        }

        public void uncaughtException(Thread thread, Throwable exception) {
            StringWriter stackTrace = new StringWriter();
            exception.printStackTrace(new PrintWriter(stackTrace));
            StringBuilder errorReport = new StringBuilder();
            errorReport.append("************ CAUSE OF ERROR ************\n\n");
            errorReport.append(stackTrace.toString());

            messageBox("doStuff", stackTrace.toString());

//            Intent intent = new Intent(myContext, AnotherActivity.class);
//            intent.putExtra("error", errorReport.toString());
//            myContext.startActivity(intent);

            android.os.Process.killProcess(android.os.Process.myPid());
            System.exit(10);
        }

    }
}

